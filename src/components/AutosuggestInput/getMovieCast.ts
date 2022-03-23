import axios from "axios";

export const getMovieCast = async (id: number): Promise<number[]> => {
  const movieURL = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`;

  const results = await axios
    .get(movieURL)
    .then((res) => res.data)
    .then((data) => data.cast)
    .catch((e) => console.error(e));

  return results.map(
    (el: { [key: string]: string | boolean | number }) => el.id
  );
};
