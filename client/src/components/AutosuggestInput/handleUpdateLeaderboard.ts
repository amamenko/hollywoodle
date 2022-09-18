import { getGeolocationData } from "./getGeolocationData";
import axios from "axios";

export const handleUpdateLeaderboard = async (
  path: string,
  currentDegrees: number,
  currentMoves: number,
  storageObj: {
    [key: string]: string | number | boolean | number[];
  }
) => {
  const currentDate = new Date();
  const currentETTime = currentDate.toLocaleString("en-US", {
    timeZone: "America/New_York",
    timeStyle: "short",
  });

  const geolocationData = await getGeolocationData();

  if (
    geolocationData &&
    // geolocationData.ip &&
    geolocationData.countryCode
    // geolocationData.countryName
  ) {
    const leaderboardObj = {
      username: storageObj.username,
      countryCode: geolocationData.countryCode,
      // countryName: geolocationData.countryName,
      // ip: geolocationData.ip,
      degrees: currentDegrees + 1,
      moves: currentMoves + 1,
      time: currentETTime,
      path,
    };

    const nodeEnv = process.env.REACT_APP_NODE_ENV
      ? process.env.REACT_APP_NODE_ENV
      : "";

    await axios
      .post(
        nodeEnv && nodeEnv === "production"
          ? `${process.env.REACT_APP_PROD_SERVER}/api/update_leaderboard`
          : "http://localhost:4000/api/update_leaderboard",
        leaderboardObj,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => console.log(res))
      .catch((e) => console.error(e));
  }
};
