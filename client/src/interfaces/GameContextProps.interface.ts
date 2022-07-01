import React from "react";
import { GuessObj } from "./GuessObj.interface";

export interface GameContextProps {
  mostRecentActor: GuessObj;
  changeMostRecentActor: React.Dispatch<React.SetStateAction<GuessObj>>;
  mostRecentMovie: GuessObj;
  changeMostRecentMovie: React.Dispatch<React.SetStateAction<GuessObj>>;
}
