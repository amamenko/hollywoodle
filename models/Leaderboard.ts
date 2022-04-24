import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({
  date: String,
  leaderboard: [
    {
      rank: Number,
      username: String,
      countryCode: String,
      countryName: String,
      moves: Number,
      time: String,
      path: String,
    },
  ],
});

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);

export { Leaderboard };
