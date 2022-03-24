import { useContext } from "react";
import { AppContext } from "../../App";
import { AutosuggestInput } from "../AutosuggestInput/AutosuggestInput";
import "./InteractiveResponse.scss";

interface InteractiveResponseProps {
  actor1: string;
  actor2?: string;
  movie?: string;
  incorrect?: boolean;
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
  const { guesses } = useContext(AppContext);
  const mostRecentGuess = guesses[guesses.length - 1];

  const typeOfGuess = !mostRecentGuess
    ? "movie"
    : mostRecentGuess.incorrect
    ? mostRecentGuess.type === "actor"
      ? "actor"
      : "movie"
    : mostRecentGuess.type === "actor"
    ? "movie"
    : "actor";
  console.log({ actor1 });
  return (
    <div className="interactive_container">
      {actor1 && actor2 ? (
        <>
          {typeOfGuess === "movie" ? (
            <div className="question_container">
              <div className="question_emoji">🎥</div>
              <p>
                Can you think of a movie starring <b>{actor1}</b> and either{" "}
                <b>{actor2}</b> or someone else <b>{actor2}</b> has worked with?
              </p>
            </div>
          ) : (
            <div className="question_container">
              <div className="question_emoji">🎭</div>
              <p>
                Can you think of someone in{" "}
                <b>
                  {mostRecentGuess.guess} ({mostRecentGuess.year})
                </b>{" "}
                who was also in a movie with <b>{actor2}</b>?
              </p>
            </div>
          )}
          <AutosuggestInput typeOfGuess={typeOfGuess} />
        </>
      ) : (
        <p>
          <b>{actor1}</b>{" "}
          {incorrect ? (
            <b className="incorrect">WAS NOT</b>
          ) : (
            <b className="correct">WAS</b>
          )}{" "}
          in{" "}
          <b>
            {movie}
            {year ? ` (${year})` : ""}
          </b>
          .
          <br />
          You gained {points} points.
        </p>
      )}
    </div>
  );
};
