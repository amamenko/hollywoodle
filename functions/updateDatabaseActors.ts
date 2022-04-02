import { updateActors } from "./updateActors";
import { Actor } from "../models/Actor";
import { format, subDays } from "date-fns";

export const updateDatabaseActors = async () => {
  const allDbActors = await Actor.find({});
  const allBlacklistedIDs = allDbActors.map((actor) => actor.id);

  // One week ago
  const weekAgo = format(subDays(new Date(), 7), "MM/dd/yyyy");
  // Few extra day padding just in case anything left over for any reason
  const weekAgoAndDay = format(subDays(new Date(), 8), "MM/dd/yyyy");
  const weekAgoAndTwoDays = format(subDays(new Date(), 9), "MM/dd/yyyy");
  const weekAgoAndThreeDays = format(subDays(new Date(), 10), "MM/dd/yyyy");

  // Clean up actors from week ago
  await Actor.deleteMany({
    date: {
      $in: [weekAgo, weekAgoAndDay, weekAgoAndTwoDays, weekAgoAndThreeDays],
    },
  }).catch((e) => console.error(e));

  const resultActors = await updateActors(allBlacklistedIDs);

  // Create first actor document for today
  await Actor.create(resultActors.actor1Obj).catch((e) => console.error(e));
  // Create last actor document for today
  await Actor.create(resultActors.actor2Obj).catch((e) => console.error(e));
  console.log(
    `Successfully created first and last actors for ${new Date().toLocaleDateString()}!`
  );
};
