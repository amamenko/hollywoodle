import "dotenv/config";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { updateDatabaseActors } from "./functions/updateDatabaseActors";
import { Actor } from "./models/Actor";
import cron from "node-cron";
import enforce from "express-sslify";
import cors from "cors";

const app = express();

const port = process.env.PORT || 4000;

// Cross-Origin Requests
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://hollywoodle.ml"
        : "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);

if (process.env.NODE_ENV === "production") {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

app.get("/api/actor", [], async (req: Request, res: Response) => {
  const actor = await Actor.find().catch((e) => console.error(e));
  res.send(actor);
});

// Update actors in MongoDB every night at midnight
cron.schedule("0 0 * * *", () => {
  updateDatabaseActors();
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

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
