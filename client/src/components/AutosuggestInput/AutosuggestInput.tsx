import React, {
  KeyboardEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
// import axios from "axios";
import Autosuggest, {
  GetSuggestionValue,
  SuggestionsFetchRequested,
} from "react-autosuggest";
import { Button } from "reactstrap";
import { AppContext } from "../../App";
import { toast } from "react-toastify";
import Scroll from "react-scroll";
import { getSuggestions } from "./getSuggestions";
import debounce from "lodash.debounce";
import isMobile from "ismobilejs";
import { AiOutlineSearch } from "react-icons/ai";
import { WhoButton } from "../ActorMovieContainer/WhoButton/WhoButton";
import * as Ladda from "ladda";
// import { handleUpdateLeaderboard } from "./handleUpdateLeaderboard";
import "../Header/Leaderboard/Leaderboard.scss";
import "./Autosuggest.scss";
import "ladda/dist/ladda.min.css";

const scroll = Scroll.animateScroll;

export interface GuessType {
  [key: string]:
    | string
    | number
    | boolean
    | number[]
    | {
        [key: string]: string | number;
      };
}

export const sortAsc = (a: GuessType, b: GuessType) => {
  return (a ? Number(a.guess_number) : 0) - (b ? Number(b.guess_number) : 0);
};

export const AutosuggestInput = ({
  typeOfGuess = "movie",
}: {
  typeOfGuess: "movie" | "actor";
}) => {
  const currentIsMobile = isMobile();

  const [inputInitiallyFocused, changeInputInitiallyFocused] = useState(true);
  const [inputValue, changeInputValue] = useState("");
  const [suggestions, changeSuggestions] = useState<
    { [key: string]: string | number | boolean }[]
  >([]);
  const [hintCollapsed, changeHintCollapsed] = useState(false);

  const {
    firstActor,
    lastActor,
    guesses,
    changeGuesses,
    guessLoading,
    currentMoves,
    changeCurrentMoves,
    changeWin,
    darkMode,
    currentEmojiGrid,
    changeEmojiGrid,
    currentlyPlayingDate,
    objectiveCurrentDate,
    movieCast,
    changeMovieCast,
    currentSelection,
    changeCurrentSelection,
    currentDegrees,
    changeCurrentDegrees,
    updateWinData,
    changeUpdateWinData,
  } = useContext(AppContext);

  const debounceFn = (type: "movie" | "actor") => {
    return debounce(({ value }) => {
      onSuggestionsFetchRequested(
        value,
        type
      ) as unknown as SuggestionsFetchRequested;
    }, 300);
  };

  // Stores reference to the debounced callback
  const movieDebouncedSearch = useRef(debounceFn("movie")).current;
  const actorDebouncedSearch = useRef(debounceFn("actor")).current;
  const laddaRef = useRef<HTMLButtonElement | null>(null);

  const onSuggestionsFetchRequested = async (
    value: string,
    typeOfGuess: "movie" | "actor"
  ) => {
    changeSuggestions(await getSuggestions(value, typeOfGuess));
  };

  const onSuggestionsClearRequested = () => {
    changeSuggestions([]);
  };

  const getSuggestionValue = (
    suggestion: GetSuggestionValue<{ [key: string]: string | number }>
  ) => suggestion.name;

  useEffect(() => {
    if (laddaRef && laddaRef.current) {
      let l = Ladda.create(laddaRef.current);
      if (guessLoading) {
        l.start();
      } else {
        if (l.isLoading()) {
          l.stop();
        }
      }
    }
  }, [guessLoading]);

  const handleInputGuess = async ({
    id,
    name,
    year,
    image,
  }: {
    id: number;
    name: string;
    year: string;
    image: string;
  }) => {
    if (!name) {
      toast.error(<p className="toast_message">Unknown {typeOfGuess}!</p>, {
        theme: "dark",
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Don't show any more toasts in queue
      setTimeout(() => toast.clearWaitingQueue(), 500);
    } else {
      let currentActorId: number = Number(firstActor.id);

      const sortedGuesses = guesses.sort(sortAsc);

      const prevGuess = sortedGuesses[guesses.length - 1];
      // Latest guess comes first
      sortedGuesses.reverse();
      const lastCorrectActor = sortedGuesses.find(
        (el) => el.type === "actor" && !el.incorrect
      );

      const formatGuessObj = (guess: GuessType) => {
        if (guess && guess.guess) {
          return {
            id: Number(guess.id),
            guess: guess.guess.toString(),
            type: guess.type.toString(),
            year: guess.year.toString(),
          };
        } else {
          return { id: 0, guess: "", type: "", year: "" };
        }
      };

      const lastCorrectMovie = sortedGuesses.find(
        (el) => el.type === "movie" && !el.incorrect
      );

      if (typeOfGuess === "actor") {
        if (
          lastCorrectMovie &&
          lastCorrectMovie.cast &&
          Array.isArray(lastCorrectMovie.cast)
        ) {
          changeMovieCast(lastCorrectMovie.cast);
          currentActorId = id;
        }
      } else {
        currentActorId = lastCorrectActor
          ? Number(lastCorrectActor.id)
          : prevGuess && prevGuess.type === "actor"
          ? Number(prevGuess.id)
          : Number(firstActor.id);
      }

      let incorrectStatus: boolean | string = true;
      let gameOver = false;

      if (movieCast.find((id) => id === lastActor.id)) {
        incorrectStatus = "partial";
        if (movieCast.find((id) => id === currentActorId)) {
          changeCurrentDegrees(currentDegrees + 1);
          incorrectStatus = false;
          // User has won and completed the game
          changeWin(true);
          gameOver = true;

          if (currentlyPlayingDate === objectiveCurrentDate) {
            if (localStorage.getItem("hollywoodle-statistics")) {
              const storageStr = localStorage.getItem("hollywoodle-statistics");
              let storageObj: {
                [key: string]: number | number[] | string | boolean;
              } = {};

              try {
                storageObj = JSON.parse(storageStr ? storageStr : "");
              } catch (e) {
                console.error(e);
              }

              const currentStreak = Number(storageObj.current_streak) + 1;
              let currentAvgs: number[] = [];

              if (storageObj.avg_moves && Array.isArray(storageObj.avg_moves)) {
                currentAvgs = storageObj.avg_moves;
              }

              currentAvgs.push(currentMoves + 1);

              if (
                objectiveCurrentDate === storageObj.current_date &&
                !storageObj.played_today
              ) {
                if (!updateWinData) changeUpdateWinData(true);
                // if (
                //   storageObj.username &&
                //   storageObj.leaderboard_eligible &&
                //   !storageObj.leaderboard_viewed
                // ) {
                //   // User is eligible for today's leaderboard - check if qualifies
                //   await handleUpdateLeaderboard(
                //     path
                //     currentDegrees,
                //     currentMoves,
                //     storageObj
                //   );
                // }

                localStorage.setItem(
                  "hollywoodle-statistics",
                  JSON.stringify({
                    current_date: objectiveCurrentDate,
                    last_played: objectiveCurrentDate,
                    current_streak: currentStreak,
                    max_streak: Math.max(
                      currentStreak,
                      Number(storageObj.max_streak)
                    ),
                    avg_moves: currentAvgs,
                    played_today: true,
                    // username: storageObj.username,
                    // username_can_be_changed: storageObj.username_can_be_changed,
                    // leaderboard_viewed: storageObj.leaderboard_viewed,
                    // leaderboard_eligible: false,
                  })
                );
              }
            } else {
              localStorage.setItem(
                "hollywoodle-statistics",
                JSON.stringify({
                  current_date: objectiveCurrentDate,
                  last_played: objectiveCurrentDate,
                  current_streak: 1,
                  max_streak: 1,
                  avg_moves: [currentMoves + 1],
                  played_today: true,
                  // username: "",
                  // username_can_be_changed: new Date().getTime(),
                  // leaderboard_viewed: false,
                  // leaderboard_eligible: false,
                })
              );
            }
          }
        }
      } else {
        if (movieCast.find((id) => id === currentActorId)) {
          if (typeOfGuess === "movie") {
            changeCurrentDegrees(currentDegrees + 1);
          }
          incorrectStatus = false;
        } else {
          incorrectStatus = true;
        }
      }

      const newGuess: GuessType = {
        guess_number: guesses.length,
        id,
        guess: name,
        prev_guess: formatGuessObj(prevGuess),
        last_correct_actor: formatGuessObj(
          lastCorrectActor ? lastCorrectActor : {}
        ),
        last_correct_movie: formatGuessObj(
          lastCorrectMovie ? lastCorrectMovie : {}
        ),
        year,
        image,
        incorrect: incorrectStatus,
        cast: movieCast,
        type: typeOfGuess,
      };

      const pointsAlloted =
        incorrectStatus === "partial" ? 2 : incorrectStatus ? 3 : 1;

      const currentTotalMoves = currentMoves + pointsAlloted;

      const emojiGridClone = currentEmojiGrid.slice();

      if (incorrectStatus === "partial") {
        emojiGridClone.push("🟧");
        emojiGridClone.push("🟧");
      } else if (incorrectStatus) {
        emojiGridClone.push("🟥");
        emojiGridClone.push("🟥");
        emojiGridClone.push("🟥");
      } else {
        emojiGridClone.push("🟩");
      }

      if (gameOver) {
        if (currentTotalMoves > 10) {
          emojiGridClone.push("💣");
        } else if (currentTotalMoves >= 5) {
          emojiGridClone.push("🍸");
        } else {
          emojiGridClone.push("🏆");
        }
      }

      changeEmojiGrid(emojiGridClone);
      changeInputInitiallyFocused(true);
      changeCurrentMoves(currentTotalMoves);
      changeHintCollapsed(false);
      changeGuesses([...guesses, newGuess]);
      changeInputValue("");
      changeCurrentSelection({
        id: 0,
        name: "",
        year: "",
        image: "",
      });

      // Only scroll more on click on larger screens
      if (!currentIsMobile.any) {
        scroll.scrollMore(400);
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter") {
      if (currentSelection && currentSelection.name) {
        handleInputGuess(currentSelection);
      }
    }
  };

  const handleSuggestionSelected = (
    e: React.FormEvent<any>,
    data: Autosuggest.SuggestionSelectedEventData<{
      [key: string]: string | number | boolean;
    }>
  ) => {
    const suggestion = data.suggestion;
    changeCurrentSelection({
      id: Number(suggestion.id),
      name: suggestion.name.toString(),
      year: suggestion.year ? suggestion.year.toString() : "",
      image: suggestion.image.toString(),
    });
  };

  const renderSuggestion = (suggestion: {
    [key: string]: string | number | boolean;
  }) => (
    <div className={`suggestion_container ${darkMode ? "dark" : ""}`}>
      <img
        className="suggestion_image"
        src={suggestion.image.toString()}
        alt={`${suggestion.name}`}
      />{" "}
      <p className="suggested_name">
        {suggestion.name.toString()}
        {suggestion.year ? ` (${suggestion.year})` : ""}
      </p>
    </div>
  );

  const autoFocusInput = () => {
    if (inputInitiallyFocused) {
      setTimeout(() => {
        const inputEl = document.getElementById("autosuggest_input");
        if (inputEl && !inputValue) inputEl.focus();
        changeInputInitiallyFocused(false);
      }, 500);
    }
  };

  return (
    <div className={`input_container ${darkMode ? "dark" : ""}`}>
      <Autosuggest
        ref={autoFocusInput}
        suggestions={suggestions}
        onSuggestionsFetchRequested={
          typeOfGuess === "movie" ? movieDebouncedSearch : actorDebouncedSearch
        }
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={
          getSuggestionValue as unknown as GetSuggestionValue<{
            [key: string]: string | number | boolean;
          }>
        }
        renderSuggestion={renderSuggestion}
        renderInputComponent={(inputProps) => (
          <div className="autosuggest_input_container">
            <input {...inputProps} />
            <div className="input_symbol_container">
              <AiOutlineSearch size={20} color={"rgb(150, 150, 150)"} />
            </div>
          </div>
        )}
        containerProps={{
          className: "autosuggest_container",
        }}
        inputProps={{
          className: `autosuggest_input form-control ${darkMode ? "dark" : ""}`,
          id: "autosuggest_input",
          value: inputValue,
          onChange: (form, event) => {
            changeInputValue(event.newValue.toUpperCase());
          },
          onKeyDown: handleKeyDown,
        }}
        onSuggestionSelected={handleSuggestionSelected}
      />
      <div className="guess_button_container">
        <div className="question_emoji">
          {" "}
          {typeOfGuess === "movie" ? "🎬" : "🎭"}
        </div>
        <Button
          className={`guess_button ladda-button ${
            darkMode ? "dark" : "light"
          } ${guessLoading ? "loading" : ""} leaderboard_set_username`}
          data-style="zoom-out"
          innerRef={laddaRef}
          onClick={() => handleInputGuess(currentSelection)}
        >
          <span className="ladda-label">GUESS {typeOfGuess.toUpperCase()}</span>
        </Button>
        <div className="question_emoji reversed">
          {typeOfGuess === "movie" ? "🎬" : "🎭"}
        </div>
      </div>
      {
        <div className="guess_hint_button_container">
          {guesses.length > 0 &&
            guesses.some((guess: GuessType) => !guess.incorrect) && (
              <WhoButton
                typeOfGuess={typeOfGuess}
                hintCollapsed={hintCollapsed}
                changeHintCollapsed={changeHintCollapsed}
              />
            )}
        </div>
      }
    </div>
  );
};
