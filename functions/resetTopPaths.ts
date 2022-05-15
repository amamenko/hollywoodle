import { Path } from "../models/Path";
import { format, subDays } from "date-fns";

const dayBefore = format(subDays(new Date(), 2), "MM/dd/yyyy");
const yesterday = format(subDays(new Date(), 1), "MM/dd/yyyy");
const today = format(new Date(), "MM/dd/yyyy");

export const resetTopPaths = async () => {
  // Clean up any recent paths
  await Path.deleteMany({
    date: {
      $in: [today, yesterday, dayBefore],
    },
  }).catch((e) => console.error(e));

  // Create path document for today
  await Path.create({
    date: today,
    paths: [],
  }).catch((e) => console.error(e));
};
