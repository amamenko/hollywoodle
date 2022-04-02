import sample from "lodash.sample";
import axios from "axios";

export const getRandomPopularActor = async (
  allBlacklistedIDs: number[],
  exceptedName?: string,
  exceptedName2?: string
) => {
  let triesCounter = 0;

  while (triesCounter < 100) {
    console.log(`Try #${triesCounter}`);

    const pageArr = [];

    for (let i = 1; i <= 200; i++) {
      pageArr.push(i);
    }

    const randomPage = sample(pageArr);

    // Get random popular actor between pages 1-200 of TMDB's Popular Actors list
    const searchURL = `https://api.themoviedb.org/3/person/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=${randomPage}`;

    const results = await axios
      .get(searchURL)
      .then((res) => res.data)
      .then((data) => data.results)
      .catch((e) => console.error(e));

    if (results) {
      const filteredResults = results.filter(
        (currentActor: { [key: string]: any }) =>
          !currentActor.known_for.some(
            (movie: { [key: string]: any }) =>
              movie.video ||
              movie.media_type === "tv" ||
              movie.adult ||
              movie.original_language !== "en" ||
              movie.vote_count < 10000
          ) &&
          currentActor.known_for_department === "Acting" &&
          currentActor.profile_path &&
          !currentActor.adult &&
          currentActor.popularity >= 17.5 &&
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
