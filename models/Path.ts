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
    },
  ],
});

const Path = mongoose.model("Path", pathSchema);

export { Path };
