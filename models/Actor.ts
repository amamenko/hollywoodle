import mongoose from "mongoose";

const actorSchema = new mongoose.Schema({
  name: String,
  image: String,
  id: Number,
  type: String,
  gender: String,
  date: String,
  most_popular_recent_movie: {
    title: String,
    year: Number,
    character: String,
  },
});

const Actor = mongoose.model("Actor", actorSchema);

export { Actor };
