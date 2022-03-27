import mongoose from "mongoose";

interface ActorDoc extends mongoose.Document {
  name: string;
  image: string;
  id: number;
  type: string;
}

interface IActor {
  name: string;
  image: string;
  id: number;
  type: string;
}

interface ActorModelInterface extends mongoose.Model<ActorDoc> {
  build(attr: IActor): ActorDoc;
}

const actorSchema = new mongoose.Schema({
  name: String,
  image: String,
  id: Number,
  type: String,
});

actorSchema.statics.build = (attr: IActor) => {
  return new Actor(attr);
};

const Actor = mongoose.model("Actor", actorSchema);

export { Actor };
