import "dotenv/config";
import { format } from "date-fns";
import { Actor } from "../models/Actor";
import { Path } from "../models/Path";
import { logger } from "../logger/logger";

export const updateActorMostPopularPath = async () => {
  const currentDate = format(new Date(), "MM/dd/yyyy");
  const dateFilter = { date: currentDate };
  let currentTopPaths = await Path.find(dateFilter).lean();
  if (currentTopPaths[0].paths) {
    const allTopPaths = currentTopPaths[0].paths;
    const allDegrees = allTopPaths.map((el) => Number(el.degrees));
    const lowestDegree = Math.min(...allDegrees);
    // Find the first (most popular) path with the lowest degrees
    const mostPopularBestPath = allTopPaths.find(
      (el) => el.degrees === lowestDegree
    );
    if (mostPopularBestPath) {
      const degrees = mostPopularBestPath.degrees;
      const path = mostPopularBestPath.path;

      if (path && degrees) {
        const mostPopularPathUpdate = {
          most_popular_path: {
            degrees,
            path,
          },
        };
        try {
          await Actor.updateMany(dateFilter, mostPopularPathUpdate);
          const successStatement = `Successfully updated most popular path for ${currentDate} actors!`;
          if (process.env.NODE_ENV === "production") {
            logger("server").info(successStatement);
          } else {
            console.log(successStatement);
          }
        } catch (e) {
          if (process.env.NODE_ENV === "production") {
            logger("server").error(e.message);
          } else {
            console.error(e);
          }
        }
      } else {
        const missingStatement = `Missing path or degrees when trying to update most popular path for ${currentDate} actors!`;
        if (process.env.NODE_ENV === "production") {
          logger("server").info(missingStatement);
        } else {
          console.log(missingStatement);
        }
      }
    } else {
      const cantFindStatement = `Couldn't find most popular/best path while trying to update most popular path for ${currentDate} actors!`;
      if (process.env.NODE_ENV === "production") {
        logger("server").info(cantFindStatement);
      } else {
        console.log(cantFindStatement);
      }
    }
  }
};
