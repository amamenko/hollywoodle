import { format } from "date-fns";
import mongoose from "mongoose";
import { RequestQuery } from "..";
import { Path } from "../models/Path";

export const updateVoteComments = async (query: {
  [key: string]: string | number;
}) => {
  // const { vote, id } = query as RequestQuery;
  const id = "";
  const topPaths = await Path.findOne({
    "paths.comments._id": new mongoose.Types.ObjectId(id),
  });
};
