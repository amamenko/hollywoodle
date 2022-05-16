import { format } from "date-fns";
import { Actor } from "../models/Actor";
import { Path } from "../models/Path";

export const updateActorMostPopularPath = async () => {
  const currentDate = format(new Date(), "MM/dd/yyyy");
  const dateFilter = { date: currentDate };
  let currentTopPaths = await Path.find(dateFilter);
  if (currentTopPaths[0].paths) {
    currentTopPaths = currentTopPaths[0].paths;
    const mostPopularPath = currentTopPaths[0];
    const degrees = mostPopularPath.degrees;
    const path = mostPopularPath.path;

    if (path && degrees) {
      const mostPopularPathUpdate = {
        most_popular_path: {
          degrees,
          path,
        },
      };
      try {
        await Actor.updateMany(dateFilter, mostPopularPathUpdate);
        console.log(
          `Successfully updated most popular path for ${currentDate} actors!`
        );
      } catch (e) {
        console.error(e);
      }
    }
  }
};
