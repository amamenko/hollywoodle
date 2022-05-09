import { GuessType, sortAsc } from "./AutosuggestInput";
import { getGeolocationData } from "./getGeolocationData";
import { ActorObj } from "../../App";
import axios from "axios";

export const handleUpdateLeaderboard = async (
  name: string,
  year: string,
  firstActor: ActorObj,
  lastActor: ActorObj,
  currentDegrees: number,
  currentMoves: number,
  guesses: GuessType[],
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
    geolocationData.ip &&
    geolocationData.countryCode &&
    geolocationData.countryName
  ) {
    let pathArr = [];
    pathArr.push(firstActor.name);
    const clonedGuesses = [...guesses];
    const correctGuesses = clonedGuesses
      .sort(sortAsc)
      .filter((guess) => !guess.incorrect && guess.incorrect !== "partial");
    pathArr = [
      ...pathArr,
      ...correctGuesses.map((guess) =>
        guess.type === "movie" ? `${guess.guess} (${guess.year})` : guess.guess
      ),
    ];
    // Needed since last movie guess is not reflected in state guesses yet
    pathArr.push(`${name} (${year})`);
    pathArr.push(lastActor.name);

    const leaderboardObj = {
      username: storageObj.username,
      countryCode: geolocationData.countryCode,
      countryName: geolocationData.countryName,
      ip: geolocationData.ip,
      degrees: currentDegrees + 1,
      moves: currentMoves + 1,
      time: currentETTime,
      path: pathArr.join(" ➡️ "),
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
