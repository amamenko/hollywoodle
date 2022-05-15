import { Path } from "../models/Path";
import { format, subDays, addDays } from "date-fns";

const dayBefore = format(subDays(new Date(), 2), "MM/dd/yyyy");
const yesterday = format(subDays(new Date(), 1), "MM/dd/yyyy");
const today = format(new Date(), "MM/dd/yyyy");
const tomorrow = format(addDays(new Date(), 1), "MM/dd/yyyy");

export const resetTopPaths = async () => {
  // Clean up any recent paths
  await Path.deleteMany({
    date: {
      $in: [today, yesterday, dayBefore],
    },
  }).catch((e) => console.error(e));

  // Create path document for tomorrow
  await Path.create({
    date: tomorrow,
    paths: [],
  }).catch((e) => console.error(e));
};
