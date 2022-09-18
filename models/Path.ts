import mongoose from "mongoose";

const pathSchema = new mongoose.Schema({
  date: String,
  paths: [
    {
      degrees: Number,
      count: Number,
      path: String,
      emotes: {
        like: Number,
        oscar: Number,
        anger: Number,
        wow: Number,
        boring: Number,
        haha: Number,
      },
      comments: [
        {
          userId: String,
          comment: String,
          emoji: String,
          background: String,
          country: String,
          city: String,
          score: Number,
          time: { type: Date, default: Date.now },
        },
      ],
    },
  ],
});

const Path = mongoose.model("Path", pathSchema);

export { Path };
