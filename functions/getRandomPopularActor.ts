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

  while (triesCounter < 25) {
    console.log(`Try #${triesCounter}`);

    const pageArr = [];

    // First run, try very top actors
    if (triesCounter <= 5) {
      for (let i = 1; i <= 5; i++) {
        pageArr.push(i);
      }
      // No luck after first run, try second tier popularity
    } else if (triesCounter <= 10) {
      for (let i = 6; i <= 10; i++) {
        pageArr.push(i);
      }
      // Again no luck after second run - try third tier popularity
    } else if (triesCounter <= 15) {
      for (let i = 11; i <= 15; i++) {
        pageArr.push(i);
      }
      // Again no luck after third run - try fourth tier popularity
    } else if (triesCounter <= 20) {
      for (let i = 16; i <= 20; i++) {
        pageArr.push(i);
      }
      // Final try to loop through pages 21-25 of popularity
    } else {
      for (let i = 21; i <= 25; i++) {
        pageArr.push(i);
      }
    }

    const randomPage = sample(pageArr);

    // Get random popular actor between pages 1-25 of TMDB's Popular Actors list
    const searchURL = `https://api.themoviedb.org/3/person/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=${randomPage}`;

    const results = await axios
      .get(searchURL)
      .then((res) => res.data)
      .then((data) => data.results)
      .catch((e) => console.error(e));

    if (results) {
      // These TV shows almost always gets bumped to the top for actors' most known for roles
      const whitelistedTVShowsArr = [
        "the simpsons",
        "grey's anatomy",
        "friends",
        "game of thrones",
      ];

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
          (currentActor.known_for[0].media_type === "movie" ||
            whitelistedTVShowsArr.find(
              (el) => el === currentActor.known_for[0].name.toLowerCase()
            )) &&
          currentActor.known_for
            .map((movie: { [key: string]: any }) => movie.media_type)
            .filter((el: string) => el === "movie").length >= 2 &&
          currentActor.known_for_department === "Acting" &&
          currentActor.profile_path &&
          currentActor.id <= 2000000 &&
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
