import { ActorObj } from "../../interfaces/ActorObj.interface";
import { GuessObj } from "../../interfaces/GuessObj.interface";

export const handleActorProp = (
  mostRecentMovie: GuessObj,
  mostRecentActor: GuessObj,
  firstActor: ActorObj
) => {
  if (mostRecentActor && mostRecentActor.guess) {
    if (
      !mostRecentMovie ||
      !mostRecentMovie.guess_number ||
      !mostRecentActor.incorrect
    ) {
      return mostRecentActor.guess.toString();
    } else {
      if (
        mostRecentActor.last_correct_actor &&
        typeof mostRecentActor.last_correct_actor === "object" &&
        !Array.isArray(mostRecentActor.last_correct_actor)
      ) {
        if (mostRecentActor.last_correct_actor.guess) {
          return mostRecentActor.last_correct_actor.guess.toString();
        } else {
          return firstActor.name;
        }
      } else {
        return firstActor.name;
      }
    }
  } else {
    return firstActor.name;
  }
};
