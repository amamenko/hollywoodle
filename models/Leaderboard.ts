import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({
  date: String,
  leaderboard: [
    {
      rank: Number,
      username: String,
      countryCode: String,
      countryName: String,
      degrees: Number,
      moves: Number,
      time: Date,
      path: String,
    },
  ],
});

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);

export { Leaderboard };
