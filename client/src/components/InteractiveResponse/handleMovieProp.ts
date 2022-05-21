import { GuessObj } from "../../interfaces/GuessObj.interface";

export const handleMovieProp = (
  mostRecentMovie: GuessObj,
  mostRecentActor: GuessObj,
  result: string
) => {
  if (mostRecentMovie && mostRecentMovie.guess) {
    if (
      !mostRecentActor ||
      !mostRecentActor.guess_number ||
      !mostRecentMovie.incorrect
    ) {
      return result;
    } else {
      if (
        mostRecentMovie.last_correct_movie &&
        typeof mostRecentMovie.last_correct_movie === "object" &&
        !Array.isArray(mostRecentMovie.last_correct_movie)
      ) {
        return mostRecentMovie.last_correct_movie.guess.toString();
      } else {
        return "";
      }
    }
  } else {
    return "";
  }
};
