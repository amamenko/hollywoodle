import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import { AutosuggestInput } from "../AutosuggestInput/AutosuggestInput";
import axios from "axios";
import { getMovieCast } from "./getMovieCast";
import "./InteractiveResponse.scss";

interface InteractiveResponseProps {
  actor1: string;
  actor2?: string;
  movie?: string;
  incorrect?: boolean | string;
  year?: string;
  points?: number;
}

export const InteractiveResponse = ({
  actor1,
  actor2,
  movie,
  incorrect = false,
  year = "",
  points = 0,
}: InteractiveResponseProps) => {
  const { guesses, firstActor, lastActor, darkMode } = useContext(AppContext);
  // Handle in-game selections and associated data fetching for movies
  const [currentSelection, changeCurrentSelection] = useState({
    id: 0,
    name: "",
    year: "",
    image: "",
  });
  const [movieCast, changeMovieCast] = useState<number[]>([]);

  const mostRecentGuess = guesses.sort((a, b) => {
    return (a ? Number(a.guess_number) : 0) - (b ? Number(b.guess_number) : 0);
  })[guesses.length - 1];

  const typeOfGuess = !mostRecentGuess
    ? "movie"
    : mostRecentGuess.incorrect || mostRecentGuess.incorrect === "partial"
    ? mostRecentGuess.type === "actor"
      ? "actor"
      : "movie"
    : mostRecentGuess.type === "actor"
    ? "movie"
    : "actor";

  useEffect(() => {
    const source = axios.CancelToken.source();

    // Refetch cast list when current selection changes and the type of guess is a movie
    if (currentSelection && currentSelection.id && typeOfGuess === "movie") {
      const fetchData = async () => {
        try {
          const results = await getMovieCast(currentSelection.id);
          changeMovieCast(results);
        } catch (e) {
          console.error(e);
        }
      };

      fetchData();
    }

    return () => source.cancel();
  }, [currentSelection, typeOfGuess]);

  return (
    <div
      className={`interactive_container ${darkMode ? "dark" : ""} ${
        points ? "question_block" : ""
      }`}
    >
      {actor1 && actor2 ? (
        <>
          {typeOfGuess === "movie" ? (
            <div className="question_container">
              <p>
                Can you think of a movie starring <b>{actor1}</b> and either{" "}
                <b>{actor2}</b> or another actor <b>{actor2}</b> has worked
                with?
              </p>
            </div>
          ) : (
            <div className="question_container">
              <p>
                Can you think of another actor in{" "}
                <b>
                  {movie} ({year})
                </b>{" "}
                who also starred in a movie with <b>{actor2}</b>?
              </p>
            </div>
          )}
          <AutosuggestInput
            typeOfGuess={typeOfGuess}
            currentSelection={currentSelection}
            changeCurrentSelection={changeCurrentSelection}
            movieCast={movieCast}
            changeMovieCast={changeMovieCast}
          />
        </>
      ) : (
        <p className="points_statement">
          <span className="response_header">
            {incorrect === "partial" ? (
              <>
                <b className="partial">PARTIAL CREDIT!</b>
                <br />
              </>
            ) : incorrect ? (
              <>
                <b className="incorrect">INCORRECT!</b>
                <br />
              </>
            ) : (
              <>
                <b className={`correct ${darkMode ? "dark" : ""}`}>CORRECT!</b>
                <br />
              </>
            )}
          </span>
          {incorrect === "partial" && "Although "}
          {incorrect !== "partial" ? (
            <b>{actor1}</b>
          ) : (
            <b>{lastActor.name}</b>
          )}{" "}
          {incorrect === "partial" ? (
            <b className="partial">DID ACT</b>
          ) : incorrect ? (
            <b className="incorrect">DID NOT ACT</b>
          ) : (
            <b className={`correct ${darkMode ? "dark" : ""}`}>DID ACT</b>
          )}{" "}
          in <br />
          <b>
            {movie}
            {year ? ` (${year})` : ""}
          </b>
          {incorrect === "partial" ? ", " : "."}
          {incorrect === "partial" ? (
            actor1 ? (
              <b>{actor1}</b>
            ) : (
              <b>{firstActor.name}</b>
            )
          ) : (
            ""
          )}{" "}
          {incorrect === "partial" ? <b className="partial">DID NOT.</b> : ""}
          <br />
          <span className="response_bottom_points">
            Your total moves increased by <b className="incorrect">{points}</b>{" "}
            {points === 1 ? "move" : "moves"}.
          </span>
        </p>
      )}
    </div>
  );
};
