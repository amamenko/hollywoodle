import sample from "lodash.sample";
import axios from "axios";

export const getRandomPopularActor = async (
  allBlacklistedIDs: number[],
  exceptedName?: string,
  exceptedName2?: string,
  blacklistedMovieTerms?: string[]
) => {
  let triesCounter = 0;

  if (!blacklistedMovieTerms) blacklistedMovieTerms = [];

  while (triesCounter < 50) {
    console.log(`Try #${triesCounter}`);

    const pageArr = [];

    for (let i = 1; i <= 50; i++) {
      pageArr.push(i);
    }

    const randomPage = sample(pageArr);

    // Get random popular actor between pages 1-50 of TMDB's Popular Actors list
    const searchURL = `https://api.themoviedb.org/3/person/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=${randomPage}`;

    const results = await axios
      .get(searchURL)
      .then((res) => res.data)
      .then((data) => data.results)
      .catch((e) => console.error(e));

    if (results) {
      const filteredResults = results.filter(
        (currentActor: { [key: string]: any }) =>
          currentActor.known_for &&
          currentActor.known_for.length >= 3 &&
          !currentActor.known_for.some(
            (movie: { [key: string]: any }) =>
              movie.video ||
              movie.adult ||
              movie.original_language !== "en" ||
              (movie.media_type === "movie"
                ? movie.vote_count < 5000
                : movie.vote_count < 3000) ||
              blacklistedMovieTerms.some((str) =>
                movie.title
                  ? movie.title.toLowerCase().includes(str)
                  : movie.name
                  ? movie.name.toLowerCase().includes(str)
                  : ""
              )
          ) &&
          currentActor.known_for[0].media_type === "movie" &&
          currentActor.known_for
            .map((movie: { [key: string]: any }) => movie.media_type)
            .filter((el: string) => el === "movie").length >= 2 &&
          currentActor.known_for_department === "Acting" &&
          currentActor.profile_path &&
          !currentActor.adult &&
          currentActor.popularity >= 16.35 &&
          !allBlacklistedIDs.includes(currentActor.id) &&
          currentActor.name !== exceptedName &&
          currentActor.name !== exceptedName2
      );

      if (filteredResults.length > 0) {
        const foundActor = sample(filteredResults);
        if (foundActor.profile_path) {
          return foundActor;
        } else {
          triesCounter++;
          continue;
        }
      } else {
        triesCounter++;
        continue;
      }
    } else {
      triesCounter++;
      continue;
    }
  }
};
