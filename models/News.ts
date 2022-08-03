import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    date: String,
    title: String,
    text: String,
    image: String,
    category: String,
  },
  { timestamps: true }
);

const News = mongoose.model("News", newsSchema);

export { News };
