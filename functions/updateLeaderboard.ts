import { format } from "date-fns";
import { getTodaysLeaderboard, RequestQuery } from "..";
import { Leaderboard } from "../models/Leaderboard";

export const updateLeaderboard = async (query: {
  [key: string]: string | number;
}) => {
  const { username, countryCode, countryName, ip, degrees, moves, time, path } =
    query as RequestQuery;

  const leaderboard: RequestQuery[] = await getTodaysLeaderboard();

  if (leaderboard.find((el) => el.ip === ip)) {
    return "IP already logged to leaderboard!";
  } else {
    const timeToNumber = (time: string) => {
      const splitTime = time.split(" ");
      const amOrPm = splitTime[1];
      const numTimeArr = splitTime[0].split(":");
      let hours = Number(numTimeArr[0]);
      const minutes = numTimeArr[1];

      if (amOrPm === "AM" && hours === 12) hours = 0;
      if (amOrPm === "PM" && hours < 12) hours += 12;

      return Number(`${hours}${minutes}`);
    };

    let leaderboardClone = leaderboard.slice();
    leaderboardClone.push({
      username,
      countryCode,
      countryName,
      ip,
      moves,
      degrees,
      time,
      path,
    });
    leaderboardClone.sort((a: RequestQuery, b: RequestQuery) => {
      // First try to sort by moves - ascending
      if (a.moves > b.moves) {
        return 1;
      } else if (a.moves < b.moves) {
        return -1;
      }

      const aTime = a.time ? timeToNumber(a.time.toString()) : 999999999;
      const bTime = b.time ? timeToNumber(b.time.toString()) : 999999999;

      // Otherwise sort by relative time - ascending
      if (aTime > bTime) {
        return 1;
      } else if (aTime < bTime) {
        return -1;
      } else {
        return 0;
      }
    });
    // Grab only the first 10 items
    leaderboardClone = leaderboardClone.slice(0, 10);
    leaderboardClone = leaderboardClone.map((el, i) => {
      return {
        rank: i,
        username: el.username,
        countryCode: el.countryCode,
        countryName: el.countryName,
        ip: el.ip,
        degrees: el.degrees,
        moves: el.moves,
        time: el.time,
        path: el.path,
      };
    });
    const initialIDs = leaderboard.map((el) =>
      el.username ? el.username.toString() + el.moves + el.time : ""
    );
    const cloneIDs = leaderboardClone.map((el) =>
      el.username ? el.username.toString() + el.moves + el.time : ""
    );

    const arrEqualityCheck = (a: string[], b: string[]) =>
      a.length === b.length && a.every((v, i) => v === b[i]);

    if (!arrEqualityCheck(initialIDs, cloneIDs)) {
      // Leaderboard changed - update needed!
      const currentDate = format(new Date(), "MM/dd/yyyy");
      const leaderboardFilter = { date: currentDate };
      const leaderboardUpdate = { leaderboard: leaderboardClone };
      await Leaderboard.findOneAndUpdate(leaderboardFilter, leaderboardUpdate);
      return "Leaderboard successfully updated!";
    } else {
      // Arrays are equal - do nothing
      return "No change in leaderboard";
    }
  }
};
