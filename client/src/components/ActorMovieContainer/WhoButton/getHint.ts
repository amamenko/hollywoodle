import { ActorObj } from "../../../App";
import { sortAsc } from "../../AutosuggestInput/AutosuggestInput";
import { format, parseISO } from "date-fns";
import * as rax from "retry-axios";
import axios from "axios";

export const getHint = async (
  guesses: {
    [key: string]:
      | string
      | number
      | boolean
      | number[]
      | {
          [key: string]: string | number;
        };
  }[],
  typeOfGuess: string,
  firstActor: ActorObj,
  lastActor: ActorObj
) => {
  const axiosInstance = axios.create({ baseURL: "https://api.themoviedb.org" });
  axiosInstance.defaults.raxConfig = {
    instance: axiosInstance,
  };
  rax.attach(axiosInstance);

  let raxConfig: { [key: string]: any } = {
    url: "",
    raxConfig: {
      retry: 10,
      noResponseRetries: 2,
      retryDelay: 750,
      httpMethodsToRetry: ["GET"],
      statusCodesToRetry: [
        [100, 199],
        [400, 499],
        [500, 599],
      ],
      instance: axiosInstance,
      backoffType: "static",
    },
  };

  const sortedGuesses = guesses.sort(sortAsc);
  sortedGuesses.reverse();

  if (typeOfGuess === "movie") {
    const mostRecentCorrectActor = sortedGuesses.find(
      (el) => el.type === "actor" && !el.incorrect
    );

    const actorID = mostRecentCorrectActor
      ? mostRecentCorrectActor.id
      : firstActor.id;

    if (actorID) {
      const searchURL = `/3/person/${actorID}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&append_to_response=movie_credits`;
      raxConfig = { ...raxConfig, url: searchURL };

      const guessMovieIDs = sortedGuesses
        .filter((guess) => guess.type === "movie")
        .map((guess) => Number(guess.id));

      const blacklistedMovieTerms = sortedGuesses
        .filter((guess) => guess.type === "movie")
        .map((movie) =>
          movie.guess
            .toString()
            .toLowerCase()
            .split(/(\s+)/)
            .filter((el) => el.length >= 5)
            .map((el) => el.replace(/[\W_]+/g, "".trim()))
        )
        .flat();

      const results = await axiosInstance(raxConfig)
        .then((res) => res.data)
        .then((data) => {
          const actorName = data.name;
          const actorGender =
            data.gender === 1 ? "female" : data.gender === 2 ? "male" : "other";
          const popularMoviesOfActor = data.movie_credits.cast.filter(
            (movie: { [key: string]: string | boolean | number }) =>
              !movie.adult &&
              !guessMovieIDs.includes(Number(movie.id)) &&
              !movie.video &&
              !blacklistedMovieTerms.some((el) =>
                movie.title.toString().toLowerCase().includes(el)
              ) &&
              movie.original_language === "en" &&
              movie.order <= 15 &&
              movie.character
          );

          // First sort by vote count and get the top 10 movies
          const sortedVoteCount = popularMoviesOfActor.sort(
            (a: { [key: string]: number }, b: { [key: string]: number }) =>
              a.vote_count > b.vote_count ? -1 : 1
          );

          // Then sort by popularity and get the most popular movie of the ones with the highest vote counts
          const sortedResults = sortedVoteCount.sort(
            (a: { [key: string]: number }, b: { [key: string]: number }) =>
              a.popularity > b.popularity ? -1 : 1
          );

          const hintMovie = sortedResults[0];

          if (hintMovie) {
            return {
              name: actorName,
              gender: actorGender,
              title: hintMovie.title,
              year: format(parseISO(hintMovie.release_date), "yyyy"),
              character: hintMovie.character,
            };
          }
        })
        .catch((e) => console.error(e));

      return results;
    }
    return;
  } else {
    const mostRecentCorrectMovie = sortedGuesses.find(
      (el) => el.type === "movie" && !el.incorrect
    );

    let currentCast: number[] = [];

    if (mostRecentCorrectMovie) {
      if (
        mostRecentCorrectMovie.cast &&
        Array.isArray(mostRecentCorrectMovie.cast)
      ) {
        currentCast = mostRecentCorrectMovie.cast;
      }

      let allActorIDs = [firstActor.id, lastActor.id];
      const guessActorIDs = sortedGuesses
        .filter((guess) => guess.type === "actor")
        .map((guess) => Number(guess.id));
      allActorIDs = [...allActorIDs, ...guessActorIDs];
      const filteredCast = currentCast.filter(
        (id) => !allActorIDs.includes(id)
      );
      const top5Actors = filteredCast.slice(0, 5);
      // The lower the ID, the longer the actor has been in the industry
      const hintID = Math.min(...top5Actors);

      if (hintID) {
        const searchURL = `/3/person/${hintID}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&append_to_response=movie_credits`;
        raxConfig = { ...raxConfig, url: searchURL };

        const results = await axiosInstance(raxConfig)
          .then((res) => res.data)
          .then((data) => {
            const popularRecentMovie = data.movie_credits.cast.find(
              (movie: { [key: string]: string | boolean | number }) =>
                movie.id === mostRecentCorrectMovie.id
            );

            const actorGender =
              data.gender === 1
                ? "female"
                : data.gender === 2
                ? "male"
                : "other";

            return {
              name: data.name,
              gender: actorGender,
              title: popularRecentMovie.title,
              year: format(parseISO(popularRecentMovie.release_date), "yyyy"),
              character: popularRecentMovie.character,
            };
          })
          .catch((e) => console.error(e));

        return results;
      }

      return;
    }
  }
};
