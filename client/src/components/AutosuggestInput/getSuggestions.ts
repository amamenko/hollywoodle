import axios from "axios";
import stringSimilarity from "string-similarity";
import { format, parseISO } from "date-fns";

interface TMDBSearchResult {
  [key: string]: string | number | boolean | number[];
}

export const getSuggestions = async (
  value: string,
  typeOfGuess: "movie" | "actor"
) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  if (inputLength < 2) {
    return [];
  } else {
    const searchURL = `https://api.themoviedb.org/3/search/${
      typeOfGuess === "movie" ? "movie" : "person"
    }?api_key=${
      process.env.REACT_APP_TMDB_API_KEY
    }&language=en-US&region=US&query=${encodeURI(
      inputValue
    )}&page=1&include_adult=false`;

    const resultSortingFunction = (
      a: TMDBSearchResult,
      b: TMDBSearchResult
    ) => {
      const aLower = a.title
        ? a.title.toString().toLowerCase()
        : a.name
        ? a.name.toString().toLowerCase()
        : "";
      const bLower = b.title
        ? b.title.toString().toLowerCase()
        : b.name
        ? b.name.toString().toLowerCase()
        : "";

      if (a.popularity < b.popularity) {
        if (inputValue === aLower && inputValue !== bLower) {
          return -1;
        } else {
          return 1;
        }
      } else if (a.popularity > b.popularity) {
        if (inputValue === bLower && inputValue !== aLower) {
          return 1;
        } else {
          return -1;
        }
      }

      const similarityA = stringSimilarity.compareTwoStrings(
        inputValue,
        aLower
      );
      const similarityB = stringSimilarity.compareTwoStrings(
        inputValue,
        bLower
      );

      if (similarityA < similarityB) {
        return 1;
      }
      if (similarityA > similarityB) {
        return -1;
      }
      return 0;
    };

    if (typeOfGuess === "movie") {
      const results = await axios
        .get(searchURL)
        .then((res) => res.data)
        .then((data) => data.results)
        .catch((e) => console.error(e));

      return results
        .filter(
          (item: TMDBSearchResult) =>
            item.backdrop_path &&
            item.poster_path &&
            Array.isArray(item.genre_ids) &&
            item.genre_ids.length > 0 &&
            item.release_date &&
            item.vote_count > 0
        )
        .sort(resultSortingFunction)
        .map((item: TMDBSearchResult) => {
          return {
            id: item.id,
            name: item.title,
            year: format(parseISO(item.release_date.toString()), "yyyy"),
            image: `https://www.themoviedb.org/t/p/w154/${item.poster_path}`,
          };
        });
    } else {
      const results = await axios
        .get(searchURL)
        .then((res) => res.data)
        .then((data) => data.results)
        .catch((e) => console.error(e));

      return results
        .filter((item: TMDBSearchResult) => item.profile_path)
        .sort(resultSortingFunction)
        .map((item: TMDBSearchResult) => {
          return {
            id: item.id,
            name: item.name,
            year: "",
            image: `https://www.themoviedb.org/t/p/w154/${item.profile_path}`,
          };
        });
    }
  }
};
