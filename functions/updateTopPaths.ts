import { format } from "date-fns";
import { RequestQuery } from "..";
import { Path } from "../models/Path";

export const updateTopPaths = async (query: {
  [key: string]: string | number;
}) => {
  const { degrees, path } = query as RequestQuery;

  const topPaths = await Path.find();
  if (topPaths[0] && topPaths[0].paths) {
    const currentTopPaths = topPaths[0].paths;
    let currentTopPathsClone = [...currentTopPaths];

    const foundPathMatchIndex = currentTopPaths.findIndex(
      (el: { [key: string]: string | number }) => el.path === path
    );

    if (foundPathMatchIndex > -1) {
      const foundEl = currentTopPathsClone[foundPathMatchIndex];
      currentTopPathsClone[foundPathMatchIndex].count = foundEl.count + 1;
    } else {
      currentTopPathsClone.push({
        degrees,
        path,
        count: 1,
      });
    }
    const sortedPaths = currentTopPathsClone.sort((a, b) =>
      a.count > b.count ? -1 : 1
    );
    const currentPathIndex = sortedPaths.findIndex((el) => el.path === path);

    const currentDate = format(new Date(), "MM/dd/yyyy");
    const topPathsFilter = { date: currentDate };
    const pathsUpdate = { paths: sortedPaths };

    await Path.findOneAndUpdate(topPathsFilter, pathsUpdate);
    return {
      rank: currentPathIndex + 1,
      count: sortedPaths[currentPathIndex]
        ? sortedPaths[currentPathIndex].count - 1
        : 0,
    };
  }
};
