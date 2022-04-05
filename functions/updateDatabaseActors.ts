import { updateActors } from "./updateActors";
import { Actor } from "../models/Actor";
import { format, subDays } from "date-fns";

export const updateDatabaseActors = async () => {
  const allDbActors = await Actor.find({});
  const allBlacklistedIDs = allDbActors.map((actor) => actor.id);
  const allBlacklistedMovieTerms = [
    ...new Set(
      allDbActors
        .map((actor) =>
          actor.most_popular_recent_movie.title
            .toLowerCase()
            .split(/(\s+)/)
            .find((el: string) => el.length >= 6)
        )
        .filter((el) => el)
        .map((el: string) => el.replace(/[\W_]+/g, "".trim()))
    ),
  ];

  // Two weeks ago
  const weekAgo = format(subDays(new Date(), 14), "MM/dd/yyyy");
  // Few extra day padding just in case anything left over for any reason
  const weekAgoAndDay = format(subDays(new Date(), 15), "MM/dd/yyyy");
  const weekAgoAndTwoDays = format(subDays(new Date(), 16), "MM/dd/yyyy");
  const weekAgoAndThreeDays = format(subDays(new Date(), 17), "MM/dd/yyyy");

  // Clean up actors from week ago
  await Actor.deleteMany({
    date: {
      $in: [weekAgo, weekAgoAndDay, weekAgoAndTwoDays, weekAgoAndThreeDays],
    },
  }).catch((e) => console.error(e));

  const resultActors = await updateActors(
    allBlacklistedIDs,
    allBlacklistedMovieTerms
  );

  // Create first actor document for today
  await Actor.create(resultActors.actor1Obj).catch((e) => console.error(e));
  // Create last actor document for today
  await Actor.create(resultActors.actor2Obj).catch((e) => console.error(e));
  console.log(
    `Successfully created first and last actors for ${new Date().toLocaleDateString()}!`
  );
};
