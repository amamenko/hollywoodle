import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import { AppContext } from "../../../App";
import { ActorObj } from "../../../interfaces/ActorObj.interface";
import { GameContext } from "../../Main";

export const ArchivePlayButton = ({
  currentArchiveDate,
  changePathOpened,
  firstActorShown,
  lastActorShown,
}: {
  currentArchiveDate: string;
  changePathOpened: React.Dispatch<React.SetStateAction<boolean>>;
  firstActorShown: ActorObj;
  lastActorShown: ActorObj;
}) => {
  const {
    darkMode,
    currentlyPlayingDate,
    changeCurrentlyPlayingDate,
    changeGuesses,
    changeCurrentMoves,
    changeWin,
    changeEmojiGrid,
    changeCurrentDegrees,
    changePathRankCount,
    changeAlreadyRewarded,
    changeFirstActor,
    changeLastActor,
  } = useContext(AppContext);
  const { changeMostRecentMovie, changeMostRecentActor } =
    useContext(GameContext);
  const navigate = useNavigate();
  const handlePlayButton = () => {
    if (currentArchiveDate !== currentlyPlayingDate) {
      changeCurrentlyPlayingDate(currentArchiveDate);
      changeFirstActor(firstActorShown);
      changeLastActor(lastActorShown);
      changeGuesses([]);
      changeCurrentMoves(0);
      changeCurrentDegrees(0);
      changeWin(false);
      changeEmojiGrid([]);
      changePathOpened(false);
      changeMostRecentMovie({
        guess: "",
        type: "",
        year: "",
      });
      changeMostRecentActor({
        guess: "",
        type: "",
        year: "",
      });
      changePathRankCount({
        rank: "",
        count: "",
      });
      changeAlreadyRewarded(false);
      navigate("/", { replace: true });
    }
  };

  return (
    <Button
      onClick={handlePlayButton}
      className={`guess_button archived_play_button ${darkMode ? "dark" : ""} ${
        currentArchiveDate === currentlyPlayingDate ? "disabled" : ""
      }`}
    >
      PLAY
    </Button>
  );
};
