import { format } from "date-fns";
import { RequestQuery } from "..";
import { Path } from "../models/Path";

export const updateEmotes = async (query: {
  [key: string]: string | number;
}) => {
  const { emote, id } = query as RequestQuery;
  const topPaths = await Path.find();
  if (topPaths[0] && topPaths[0].paths) {
    const currentTopPaths = topPaths[0].paths;
    let currentTopPathsClone = [...currentTopPaths];
    const foundPathMatchIndex = currentTopPaths.findIndex(
      (el: { [key: string]: string | number }) => el._id.toString() === id
    );
    if (foundPathMatchIndex > -1) {
      const foundEl = currentTopPathsClone[foundPathMatchIndex];
      if (emote.toString().includes("reset")) {
        const splitEmoteArr = emote.toString().split("_");
        const emoteToReset = splitEmoteArr[1].toLowerCase();
        const finalNum = foundEl.emotes[emoteToReset] - 1;
        currentTopPathsClone[foundPathMatchIndex].emotes[emoteToReset] =
          finalNum >= 0 ? finalNum : 0;
      } else {
        currentTopPathsClone[foundPathMatchIndex].emotes[emote] =
          foundEl.emotes[emote] + 1;
      }
      const currentDate = format(new Date(), "MM/dd/yyyy");
      const topPathsFilter = { date: currentDate };
      const pathsUpdate = { paths: currentTopPathsClone };
      await Path.findOneAndUpdate(topPathsFilter, pathsUpdate);
      return "Successfully updated!";
    }
  }
};
