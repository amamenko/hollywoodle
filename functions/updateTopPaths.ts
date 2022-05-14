import { format } from "date-fns";
import { RequestQuery } from "..";
import { Leaderboard } from "../models/Leaderboard";
import { Path } from "../models/Path";

export const updateTopPaths = async (query: {
  [key: string]: string | number;
}) => {
  const { degrees, path } = query as RequestQuery;

  const topPaths = await Path.find();
  if (topPaths[0] && topPaths[0].paths) {
    const currentTopPaths = topPaths[0].paths;
    let currentTopPathsClone = [...currentTopPaths];
    currentTopPathsClone.push({
      degrees,
      path,
    });
    const leaderboardUpdate = { paths: currentTopPathsClone };
    await Leaderboard.findOneAndUpdate({}, leaderboardUpdate);
    return "Leaderboard successfully updated!";
  }
};
