import "dotenv/config";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { updateDatabaseActors } from "./functions/updateDatabaseActors";
import { Actor } from "./models/Actor";
import { Leaderboard } from "./models/Leaderboard";
import { News } from "./models/News";
import cron from "node-cron";
import cors from "cors";
import enforce from "express-sslify";
import { format } from "date-fns";
import http from "http";
import { Server } from "socket.io";
import { updateLeaderboard } from "./functions/updateLeaderboard";
import { Path } from "./models/Path";
import { updateTopPaths } from "./functions/updateTopPaths";
import { updateActorMostPopularPath } from "./functions/updateActorMostPopularPath";
import { getTopPathsAggregatedData } from "./functions/getTopPathsAggregatedData";
import { postToTwitter } from "./functions/postToTwitter";

export interface RequestQuery {
  [key: string]: string | number;
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Cross-Origin Requests
app.use(cors());

// To show request body during POST requests
app.use(express.json());

const port = process.env.PORT || 4000;

if (process.env.NODE_ENV === "production") {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

const handleLiveChange = (change: { [key: string]: any }, key: string) => {
  if (change.operationType === "update") {
    const allUpdatedFields = change.updateDescription.updatedFields;
    if (allUpdatedFields) {
      let changeData = allUpdatedFields[key];
      if (key === "paths") {
        const { totalPathsFound, totalPlayers, lowestDegree, highestDegree } =
          getTopPathsAggregatedData(changeData);
        io.timeout(10000).emit(
          "pageCheck",
          true,
          (err: Error, response: number[]) => {
            if (err) {
              console.error(err);
            } else {
              let currentPage = 0;
              if (response && response[0]) currentPage = response[0];
              changeData = {
                // Only return 10 results at a time relative to current page
                paths: changeData.slice(
                  currentPage * 10,
                  currentPage * 10 + 10
                ),
                totalPathsFound,
                totalPlayers,
                lowestDegree,
                highestDegree,
              };
              io.emit("changeData", changeData);
            }
          }
        );
      }
      io.emit("changeData", changeData);
    }
  }
};

const leaderboardChangeStream = Leaderboard.watch();

leaderboardChangeStream.on("change", (change) => {
  handleLiveChange(change, "leaderboard");
});

const pathsChangeStream = Path.watch();

pathsChangeStream.on("change", (change) => {
  handleLiveChange(change, "paths");
});

app.get("/api/actor", [], async (req: Request, res: Response) => {
  const currentDate = format(new Date(), "MM/dd/yyyy");
  const actors = await Actor.find({ date: currentDate }).catch((e) =>
    console.error(e)
  );
  res.send(actors);
});

app.get("/api/archive_actor", [], async (req: Request, res: Response) => {
  const requestedDate = req.query.date;
  const requestedName = req.query.name;
  const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/gim;
  if (typeof requestedDate === "string" && dateRegex.test(requestedDate)) {
    const actors = await Actor.find({ date: requestedDate }).catch((e) =>
      console.error(e)
    );
    res.send(actors);
  } else if (requestedName && typeof requestedName === "string") {
    const actor = await Actor.find({ name: requestedName }).catch((e) =>
      console.error(e)
    );
    const allDates = Array.isArray(actor) ? actor?.map((el) => el.date) : [];
    if (allDates.length > 0) {
      const allActors = await Actor.find({
        date: {
          $in: allDates,
        },
      }).catch((e) => console.error(e));
      res.send(allActors);
    } else {
      res.send([]);
    }
  } else {
    res.send([]);
  }
});

export const getTodaysLeaderboard = async () => {
  const currentDate = format(new Date(), "MM/dd/yyyy");
  const leaderboardEl = await Leaderboard.find({ date: currentDate });

  if (leaderboardEl && leaderboardEl[0]) return leaderboardEl[0].leaderboard;
};

app.get("/api/leaderboard", [], async (req: Request, res: Response) => {
  const leaderboard: { [key: string]: string | number }[] =
    await getTodaysLeaderboard();
  res.send(leaderboard);
});

app.post("/api/update_leaderboard", [], async (req: Request, res: Response) => {
  if (req.body && typeof req.body === "object") {
    const update = await updateLeaderboard(req.body as RequestQuery);
    res.send(update);
  }
});

app.get("/api/news", [], async (req: Request, res: Response) => {
  const allNews = await News.find().sort({ date: -1 });
  res.send(allNews);
});

app.get("/api/top_paths", [], async (req: Request, res: Response) => {
  const pageRequest: number = Number(req.query.page) || 0;
  const topPaths: { [key: string]: { [key: string]: string | number }[] }[] =
    await Path.find();
  if (topPaths[0] && topPaths[0].paths) {
    const { totalPathsFound, totalPlayers, lowestDegree, highestDegree } =
      getTopPathsAggregatedData(topPaths[0].paths);
    res.send({
      paths: topPaths[0].paths.slice(pageRequest * 10, pageRequest * 10 + 10),
      totalPathsFound,
      totalPlayers,
      lowestDegree,
      highestDegree,
    });
  }
});

app.post("/api/update_top_paths", [], async (req: Request, res: Response) => {
  if (req.body && typeof req.body === "object") {
    const update = await updateTopPaths(req.body as RequestQuery);
    res.send(update);
  }
});

// Add most popular path to today's actors' documents at 11:55 PM
cron.schedule("55 23 * * *", () => {
  updateActorMostPopularPath();
});

// Update actors and reset top paths in MongoDB every night at midnight
cron.schedule("0 0 * * *", () => {
  updateDatabaseActors();
});

// Tweet about today's Hollywoodle game 1 minute past midnight
cron.schedule("1 0 * * *", () => {
  postToTwitter();
});

app.get("/", (req: Request, res: Response) => {
  res.send("The Hollywoodle server is up and running!");
});

// Connect to MongoDB with Mongoose
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_CLUSTER}.vpfgw.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
