import mongoose from "mongoose";

const pathSchema = new mongoose.Schema({
  paths: [
    {
      degrees: Number,
      count: Number,
      path: String,
    },
  ],
});

const Path = mongoose.model("Path", pathSchema);

export { Path };
