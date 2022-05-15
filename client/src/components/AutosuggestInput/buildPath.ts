import { ActorObj } from "../../App";
import { GuessType, sortAsc } from "./AutosuggestInput";

export const buildPath = (
  //   name: string,
  //   year: string,
  firstActor: ActorObj,
  lastActor: ActorObj,
  guesses: GuessType[]
) => {
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
  //   pathArr.push(`${name} (${year})`);
  pathArr.push(lastActor.name);
  return pathArr.join(" ➡️ ");
};
