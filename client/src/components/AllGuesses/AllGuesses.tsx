import React, { useCallback, useContext } from "react";
import { AppContext } from "../../App";
import { ActorMovieContainer } from "../ActorMovieContainer/ActorMovieContainer";
import { InteractiveResponse } from "../InteractiveResponse/InteractiveResponse";

export const AllGuesses = ({ mostRecentMovie }: { [key: string]: any }) => {
  const { guesses, firstActor } = useContext(AppContext);

  const renderGuesses = useCallback(() => {
    const allGuesses = guesses.slice().sort((a, b) => {
      return (
        (a ? Number(a.guess_number) : 0) - (b ? Number(b.guess_number) : 0)
      );
    });

    return allGuesses.map((el, index) => {
      const currentGuessType = el.type;

      const determineChoice = (type: string, default_val: string): string => {
        if (currentGuessType === type) {
          return el.guess.toString();
        } else {
          if (
            el.prev_guess &&
            typeof el.prev_guess === "object" &&
            !Array.isArray(el.prev_guess) &&
            el.prev_guess.guess &&
            el.prev_guess.type === type
          ) {
            return el.prev_guess.guess.toString();
          }

          if (type === "actor") {
            if (
              el.last_correct_actor &&
              typeof el.last_correct_actor === "object" &&
              !Array.isArray(el.last_correct_actor) &&
              el.last_correct_actor.guess
            ) {
              return el.last_correct_actor.guess.toString();
            }
          } else {
            if (
              el.last_correct_movie &&
              typeof el.last_correct_movie === "object" &&
              !Array.isArray(el.last_correct_movie) &&
              el.last_correct_movie.guess
            ) {
              return el.last_correct_movie.guess.toString();
            }
          }
          return default_val;
        }
      };

      const determinedActor = determineChoice("actor", firstActor.name);
      const determinedMovie = determineChoice(
        "movie",
        mostRecentMovie &&
          typeof mostRecentMovie === "object" &&
          !Array.isArray(mostRecentMovie)
          ? mostRecentMovie.guess.toString()
          : ""
      );

      if (
        typeof el.guess === "string" &&
        (typeof el.incorrect === "boolean" || typeof el.incorrect === "string")
      ) {
        return (
          <React.Fragment key={index}>
            <ActorMovieContainer
              image={el.image.toString()}
              name={el.guess}
              incorrect={el.incorrect}
            />
            <InteractiveResponse
              actor1={determinedActor}
              movie={determinedMovie}
              incorrect={el.incorrect}
              year={
                determinedMovie
                  ? mostRecentMovie &&
                    typeof mostRecentMovie === "object" &&
                    !Array.isArray(mostRecentMovie)
                    ? mostRecentMovie.year.toString()
                    : " "
                  : ""
              }
              points={el.incorrect === "partial" ? 20 : el.incorrect ? 30 : 10}
            />
          </React.Fragment>
        );
      }
      return <></>;
    });
  }, [firstActor.name, guesses, mostRecentMovie]);

  return <>{renderGuesses()}</>;
};
