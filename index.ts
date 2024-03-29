import "dotenv/config";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { updateDatabaseActors } from "./functions/updateDatabaseActors";
import { Actor } from "./models/Actor";
// import { Leaderboard } from "./models/Leaderboard";
import { News } from "./models/News";
import cron from "node-cron";
import cors from "cors";
import enforce from "express-sslify";
import { format, parse } from "date-fns";
import http from "http";
// import { updateLeaderboard } from "./functions/updateLeaderboard";
import { Path } from "./models/Path";
import { updateTopPaths } from "./functions/updateTopPaths";
import { updateEmotes } from "./functions/updateEmotes";
import { updateActorMostPopularPath } from "./functions/updateActorMostPopularPath";
import { getTopPathsAggregatedData } from "./functions/getTopPathsAggregatedData";
import { postToTwitter } from "./functions/postToTwitter";
import { handleLiveChange } from "./functions/handleLiveChange";
import { logger } from "./logger/logger";
import requestStats from "request-stats";
import { handleEventLog } from "./functions/handleEventLog";
import { WebSocketServer } from "ws";
import { deployToRender } from "./functions/deployToRender";
import { updateComments } from "./functions/updateComments";
import { updateVoteComments } from "./functions/updateVoteComments";
import nodeCleanup from "node-cleanup";
import { ActorObj } from "./client/src/interfaces/ActorObj.interface";

export interface RequestQuery {
  [key: string]: string | number;
}

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

const app = express();
// Populate req.ip
app.set("trust proxy", true);
const server = http.createServer(app);
requestStats(server, (stats) => {
  if (process.env.NODE_ENV === "production") {
    handleEventLog(stats);
  }
});

// Cross-Origin Requests
app.use(cors());

// To show request body during POST requests
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

const wss = new WebSocketServer({ server, perMessageDeflate: false });

wss.on("connection", (socket: any, req: Request) => {
  function heartbeat() {
    this.isAlive = true;
  }
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
  ip = ip ? ip.toString().split(",")[0].trim() : "";
  socket.ip = ip;
  const connectionStr = `address="${ip}"`;
  socket.isAlive = true;
  socket.on("pong", heartbeat);
  if (process.env.NODE_ENV === "production") {
    logger("server").info(`Socket connected: ${connectionStr}`);
  }
  const pathsChangeStream = Path.watch();
  pathsChangeStream.on("change", (change) => {
    // Make sure updates only emit for connected and alive sockets
    if (socket.isAlive) handleLiveChange(change, socket, "paths");
  });
  const handleDisconnect = () => {
    pathsChangeStream.close();
    if (process.env.NODE_ENV === "production") {
      logger("server").info(`Socket disconnected: ${connectionStr}`);
    }
  };
  socket.on("close", handleDisconnect);
});
const heartBeatInterval = setInterval(() => {
  wss.clients.forEach((ws: any) => {
    if (ws.isAlive === false) {
      if (process.env.NODE_ENV === "production") {
        logger("server").info(`Socked disconnected: ${ws.ip}`);
      }
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on("close", () => {
  clearInterval(heartBeatInterval);
});

app.get("/api/actor", [], async (req: Request, res: Response) => {
  const todayDate = new Date();
  const wordsCurrentDate = format(todayDate, "MMMM d, yyyy");
  const foundTodaysArticle = await News.find({
    date: wordsCurrentDate,
    draft: { $ne: true },
  })
    .select("date title image category slug")
    .lean();
  const currentDate = format(todayDate, "MM/dd/yyyy");
  const actors = await Actor.find({ date: currentDate })
    .lean()
    .catch((e) => console.error(e));

  const firstActor = actors
    ? actors.find((actor) => actor.type === "first")
    : undefined;
  const secondActor = actors
    ? actors.find((actor) => actor.type === "last")
    : undefined;
  res.send({
    actors: firstActor && secondActor ? [firstActor, secondActor] : [],
    article: foundTodaysArticle[0],
  });
});

app.get("/api/archive_actor", [], async (req: Request, res: Response) => {
  const requestedDate = req.query.date;
  const requestedName = req.query.name;
  const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/gim;
  if (typeof requestedDate === "string" && dateRegex.test(requestedDate)) {
    const actors = await Actor.find({ date: requestedDate })
      .lean()
      .catch((e) => console.error(e));
    const firstActor = actors
      ? actors.find((actor) => actor.type === "first")
      : undefined;
    const secondActor = actors
      ? actors.find((actor) => actor.type === "last")
      : undefined;
    res.send(firstActor && secondActor ? [firstActor, secondActor] : []);
  } else if (requestedName && typeof requestedName === "string") {
    const actor = await Actor.find({ name: requestedName })
      .lean()
      .catch((e) => console.error(e));
    const allDates = Array.isArray(actor) ? actor?.map((el) => el.date) : [];
    if (allDates.length > 0) {
      const allActors = await Actor.find({
        date: {
          $in: allDates,
        },
      })
        .lean()
        .catch((e) => console.error(e));
      const firstActor = allActors
        ? allActors.find((actor) => actor.type === "first")
        : undefined;
      const secondActor = allActors
        ? allActors.find((actor) => actor.type === "last")
        : undefined;
      res.send(firstActor && secondActor ? [firstActor, secondActor] : []);
    } else {
      res.send([]);
    }
  } else {
    res.send([]);
  }
});

// export const getTodaysLeaderboard = async () => {
//   const currentDate = format(new Date(), "MM/dd/yyyy");
//   const leaderboardEl = await Leaderboard.find({ date: currentDate });
//   if (leaderboardEl && leaderboardEl[0]) return leaderboardEl[0].leaderboard;
// };

// app.get("/api/leaderboard", [], async (req: Request, res: Response) => {
//   const leaderboard: { [key: string]: string | number }[] =
//     await getTodaysLeaderboard();
//   res.send(leaderboard);
// });

// app.post("/api/update_leaderboard", [], async (req: Request, res: Response) => {
//   if (req.body && typeof req.body === "object") {
//     const update = await updateLeaderboard(req.body as RequestQuery);
//     res.send(update);
//   }
// });

app.get("/api/news", [], async (req: Request, res: Response) => {
  const pageRequest: number = Number(req.query.page) || 0;
  const allNews = await News.find({ draft: { $ne: true } }).lean();
  const numResults = allNews.length;
  const parseFunc = (date: string) => parse(date, "MMMM d, yyyy", new Date());
  allNews.sort((a, b) => (parseFunc(a.date) > parseFunc(b.date) ? -1 : 1));
  const newsSnippet = allNews.slice(pageRequest * 10, pageRequest * 10 + 10);
  res.send({ news: newsSnippet, total: numResults });
});

app.get("/api/news_article", [], async (req: Request, res: Response) => {
  const slugRequest = req.query.slug || "";
  const foundArticle = await News.findOne({ slug: slugRequest }).lean();
  res.send(foundArticle);
});

app.get("/api/top_paths", [], async (req: Request, res: Response) => {
  const pageRequest: number = Number(req.query.page) || 0;
  const topPaths: { [key: string]: { [key: string]: string | number }[] }[] =
    await Path.find().lean();
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

app.get("/timezone", (req: Request, res: Response) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  res.send(timezone);
});

app.post("/api/update_top_paths", [], async (req: Request, res: Response) => {
  if (req.body && typeof req.body === "object") {
    const update = await updateTopPaths(req.body as RequestQuery);
    res.send(update);
  }
});

app.post("/api/update_emotes", [], async (req: Request, res: Response) => {
  if (req.body && typeof req.body === "object") {
    const update = await updateEmotes(req.body as RequestQuery);
    res.send(update);
  }
});

app.post("/api/update_comments", [], async (req: Request, res: Response) => {
  if (req.body && typeof req.body === "object") {
    const update = await updateComments(req.body as RequestQuery);
    res.send(update);
  }
});

app.post("/api/vote_comments", [], async (req: Request, res: Response) => {
  if (req.body && typeof req.body === "object") {
    const update = await updateVoteComments(req.body as RequestQuery);
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
    if (process.env.NODE_ENV === "production") {
      logger("server").info("Connected to MongoDB");
    } else {
      console.log("Connected to MongoDB");
    }
  })
  .catch((err) => console.log(err));

server.listen(port, () => {
  if (process.env.NODE_ENV === "production") {
    logger("server").info(`Listening on port ${port}...`);
  } else {
    console.log(`Listening on port ${port}...`);
  }
});

if (process.env.NODE_ENV === "production") {
  // Redeploy render service every 8 hours - 2:15 AM, 10:15 AM, 6:15 PM
  cron.schedule("15 2,10,18 * * *", () => {
    deployToRender();
  });

  nodeCleanup((exitCode, signal) => {
    mongoose.disconnect();
    console.log(
      `Node process exited${exitCode ? ` with exit code ${exitCode} ` : " "}${
        exitCode
          ? signal
            ? `and with signal ${signal}`
            : ""
          : signal
          ? `with signal ${signal}`
          : ""
      }.`
    );
  });
}
