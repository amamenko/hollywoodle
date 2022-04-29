import * as rax from "retry-axios";
import axios from "axios";

export const getMovieCast = async (id: number): Promise<number[]> => {
  const axiosInstance = axios.create({ baseURL: "https://api.themoviedb.org" });
  axiosInstance.defaults.raxConfig = {
    instance: axiosInstance,
  };
  rax.attach(axiosInstance);

  const movieURL = `/3/movie/${id}/credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`;

  const results = await axiosInstance({
    url: movieURL,
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
  })
    .then((res) => res.data)
    .then((data) => data.cast)
    .catch((e) => console.error(e));

  return results.map(
    (el: { [key: string]: string | boolean | number }) => el.id
  );
};
