import "dotenv/config";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { updateDatabaseActors } from "./functions/updateDatabaseActors";
import { Actor } from "./models/Actor";
import { Leaderboard } from "./models/Leaderboard";
import cron from "node-cron";
import cors from "cors";
import enforce from "express-sslify";
import { format } from "date-fns";
import http from "http";
import { Server } from "socket.io";
import { updateLeaderboard } from "./functions/updateLeaderboard";
import { Path } from "./models/Path";
import { updateTopPaths } from "./functions/updateTopPaths";

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

io.on("connection", () => {
  console.log("connected");
});

io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const handleLiveChange = (change: { [key: string]: any }, key: string) => {
  if (change.operationType === "update") {
    const allUpdatedFields = change.updateDescription.updatedFields;
    if (allUpdatedFields) {
      io.emit("changeData", allUpdatedFields[key]);
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
  const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/gim;
  if (typeof requestedDate === "string" && dateRegex.test(requestedDate)) {
    const actors = await Actor.find({ date: requestedDate }).catch((e) =>
      console.error(e)
    );
    res.send(actors);
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

app.get("/api/top_paths", [], async (req: Request, res: Response) => {
  const topPaths: { [key: string]: string | number }[] = await Path.find();
  if (topPaths[0] && topPaths[0].paths) {
    res.send(topPaths[0].paths);
  }
});

app.post("/api/update_top_paths", [], async (req: Request, res: Response) => {
  if (req.body && typeof req.body === "object") {
    const update = await updateTopPaths(req.body as RequestQuery);
    res.send(update);
  }
});

// Update actors in MongoDB every night at midnight
cron.schedule("0 0 * * *", () => {
  updateDatabaseActors();
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
