import React, { Dispatch, SetStateAction } from "react";
import { ActorObj } from "./ActorObj.interface";
import { GuessObj } from "./GuessObj.interface";
import { SelectionObj } from "./SelectionObj.interface";

export interface ContextProps {
  firstActor: ActorObj;
  lastActor: ActorObj;
  guesses: GuessObj[];
  changeGuesses: Dispatch<SetStateAction<GuessObj[]>>;
  currentMoves: number;
  changeCurrentMoves: React.Dispatch<React.SetStateAction<number>>;
  win: boolean;
  changeWin: React.Dispatch<React.SetStateAction<boolean>>;
  darkMode: boolean;
  changeDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  currentEmojiGrid: string[];
  changeEmojiGrid: React.Dispatch<React.SetStateAction<string[]>>;
  currentlyPlayingDate: string;
  changeCurrentlyPlayingDate: React.Dispatch<React.SetStateAction<string>>;
  currentArchivedActorsResults: ActorObj[];
  changeCurrentArchivedActorsResults: React.Dispatch<
    React.SetStateAction<ActorObj[]>
  >;
  fullTimezoneDate: string;
  changeFullTimezoneDate: React.Dispatch<React.SetStateAction<string>>;
  objectiveCurrentDate: string;
  changeObjectiveCurrentDate: React.Dispatch<React.SetStateAction<string>>;
  currentSelection: SelectionObj;
  changeCurrentSelection: React.Dispatch<React.SetStateAction<SelectionObj>>;
  movieCast: number[];
  changeMovieCast: React.Dispatch<React.SetStateAction<number[]>>;
  currentDegrees: number;
  changeCurrentDegrees: React.Dispatch<React.SetStateAction<number>>;
  guessLoading: boolean;
  changeGuessLoading: React.Dispatch<React.SetStateAction<boolean>>;
  updateWinData: boolean;
  changeUpdateWinData: React.Dispatch<React.SetStateAction<boolean>>;
  pathRankCount: { [key: string]: string };
  changePathRankCount: Dispatch<
    SetStateAction<{ rank: string; count: string }>
  >;
  showTopPathsModal: boolean;
  changeShowTopPathsModal: React.Dispatch<React.SetStateAction<boolean>>;
  currentHoliday: string;
  changeCurrentHoliday: React.Dispatch<React.SetStateAction<string>>;
}
