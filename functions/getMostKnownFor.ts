import { format, parseISO } from "date-fns";
import axios from "axios";

export const getMostKnownFor = async (
  id: number,
  arr: { [key: string]: any }[]
) => {
  const filteredMoviesArr = arr.filter((el) => el.media_type === "movie");
  const allCounts = filteredMoviesArr.map(
    (el: { [key: string]: any }) => el.vote_count
  );
  const highestCount = Math.max(...allCounts);
  const mostKnownMovie = filteredMoviesArr.find(
    (el) => el.vote_count === highestCount
  );

  if (mostKnownMovie) {
    const searchURL = `https://api.themoviedb.org/3/movie/${mostKnownMovie.id}/credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`;

    const castResults = await axios
      .get(searchURL)
      .then((res) => res.data)
      .then((data) => data.cast)
      .catch((e) => console.error(e));

    if (castResults) {
      const matchingActor = castResults.find(
        (actor: { [key: string]: any }) => actor.id === id
      );

      const filteredCast = castResults.filter(
        (person: { [key: string]: number }) => person.id !== id
      );
      const top10Actors = filteredCast.slice(0, 10);
      const allPopularities = top10Actors.map(
        (actor: { [key: string]: number }) => actor.popularity
      );
      const highestPopularity = Math.max(...allPopularities);
      const hintActor = top10Actors.find(
        (actor: { [key: string]: number }) =>
          actor.popularity === highestPopularity
      );

      const formattedReleaseDate = format(
        parseISO(mostKnownMovie.release_date),
        "yyyy"
      );

      return {
        title: mostKnownMovie.title,
        year: Number(formattedReleaseDate),
        character: matchingActor.character,
        costarName: hintActor.name,
        costarCharacter: hintActor.character,
      };
    } else {
      return {
        title: "",
        character: "",
        costarName: "",
        costarCharacter: "",
      };
    }
  } else {
    return {
      title: "",
      character: "",
      costarName: "",
      costarCharacter: "",
    };
  }
};
