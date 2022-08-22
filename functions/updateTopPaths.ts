import { format } from "date-fns";
import { RequestQuery } from "..";
import { Actor } from "../models/Actor";
import { Path } from "../models/Path";

export const updateTopPaths = async (query: {
  [key: string]: string | number;
}) => {
  const { degrees, path } = query as RequestQuery;

  const pathArr = path.toString().split(" ➡️ ");
  const firstNameInPath = pathArr[0];

  const currentDate = format(new Date(), "MM/dd/yyyy");
  const todaysFirstActor = await Actor.find({
    date: currentDate,
    type: "first",
  }).catch((e) => console.error(e));

  if (todaysFirstActor && todaysFirstActor[0] && todaysFirstActor[0].name) {
    const requiredFirstName = todaysFirstActor[0].name;
    // Make sure relevant path is being submitted to top paths
    if (requiredFirstName === firstNameInPath) {
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
            emotes: {
              like: 0,
              oscar: 0,
              anger: 0,
              wow: 0,
              boring: 0,
              haha: 0,
            },
          });
        }
        const sortedPaths = currentTopPathsClone.sort((a, b) => {
          // First sort by popularity count (DESC)
          if (a.count > b.count) {
            return -1;
          } else if (a.count < b.count) {
            return 1;
          }

          // Then sort by degrees (ASC)
          if (a.degrees > b.degrees) {
            return 1;
          } else if (a.degrees < b.degrees) {
            return -1;
          } else {
            return 0;
          }
        });
        const currentPathIndex = sortedPaths.findIndex(
          (el) => el.path === path
        );

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
    }
  }
};
