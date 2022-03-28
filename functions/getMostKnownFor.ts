import { format, parseISO } from "date-fns";
import axios from "axios";

export const getMostKnownFor = async (
  id: number,
  arr: { [key: string]: any }[]
) => {
  const allCounts = arr.map((el: { [key: string]: any }) => el.vote_count);
  const highestCount = Math.max(...allCounts);
  const mostKnownMovie = arr.find((el) => el.vote_count === highestCount);

  const searchURL = `https://api.themoviedb.org/3/movie/${mostKnownMovie.id}/credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`;

  const castResults = await axios
    .get(searchURL)
    .then((res) => res.data)
    .then((data) => data.cast)
    .catch((e) => console.error(e));

  const matchingActor = castResults.find(
    (actor: { [key: string]: any }) => actor.id === id
  );

  const formattedReleaseDate = format(
    parseISO(mostKnownMovie.release_date),
    "yyyy"
  );

  return {
    title: mostKnownMovie.title,
    year: Number(formattedReleaseDate),
    character: matchingActor.character,
  };
};
