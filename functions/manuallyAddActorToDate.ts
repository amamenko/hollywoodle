import axios from "axios";
import { getMostKnownFor } from "./getMostKnownFor";
import { Actor } from "../models/Actor";

export const manuallyAddActorToDate = async (
  id: number,
  date: string,
  type: string
) => {
  const actorSearchUrl = `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.TMDB_API_KEY}`;
  const result = await axios
    .get(actorSearchUrl)
    .then((res) => res.data)
    .catch((e) => console.error(e));
  if (result) {
    const actorCreditsSearchUrl = `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${process.env.TMDB_API_KEY}`;
    const allCredits = await axios
      .get(actorCreditsSearchUrl)
      .then((res) => res.data)
      .catch((e) => console.error(e));
    if (allCredits?.cast) {
      let actorMostKnownFor = await getMostKnownFor(id, allCredits.cast);
      let actorObj = {
        name: result.name,
        id: result.id,
        image: `https://image.tmdb.org/t/p/w154${result.profile_path}`,
        type,
        gender:
          result.gender === 1
            ? "female"
            : result.gender === 2
            ? "male"
            : "other",
        date,
      };
      const modifiedActorObj = {
        ...actorObj,
        most_popular_recent_movie: actorMostKnownFor,
        most_popular_path: {
          degrees: 0,
          path: "",
        },
      };
      await Actor.create(modifiedActorObj).catch((e) => console.error(e));
      console.log(
        `Successfully added ${result.name} to Hollywoodle game on ${date}!`
      );
    }
  }
};
