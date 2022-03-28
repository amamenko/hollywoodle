import { getMostKnownFor } from "./getMostKnownFor";
import { getRandomPopularActor } from "./getRandomPopularActor";

export const updateActors = async () => {
  let newActor1: { [key: string]: any } | undefined =
    await getRandomPopularActor();
  let newActor2: { [key: string]: any } | undefined;

  if (newActor1) {
    newActor2 = await getRandomPopularActor(newActor1.name);
  }

  if (newActor1 && newActor2) {
    const createActorObject = (
      name: string,
      id: number,
      image_path: string,
      type: string,
      gender: number
    ) => {
      return {
        name,
        id,
        image: `https://image.tmdb.org/t/p/w1280${image_path}`,
        type,
        gender: gender === 1 ? "female" : gender === 2 ? "male" : "other",
      };
    };

    const actor1Obj = createActorObject(
      newActor1.name,
      newActor1.id,
      newActor1.profile_path,
      "first",
      newActor1.gender
    );

    const actor1MostKnownFor = await getMostKnownFor(
      newActor1.id,
      newActor1.known_for
    );

    let actor2Obj = createActorObject(
      newActor2.name,
      newActor2.id,
      newActor2.profile_path,
      "last",
      newActor2.gender
    );

    let actor2MostKnownFor = await getMostKnownFor(
      newActor2.id,
      newActor2.known_for
    );

    if (actor2MostKnownFor.title === actor1MostKnownFor.title) {
      newActor2 = await getRandomPopularActor(newActor1.name, newActor2.name);

      actor2Obj = createActorObject(
        newActor2.name,
        newActor2.id,
        newActor2.profile_path,
        "last",
        newActor2.gender
      );

      actor2MostKnownFor = await getMostKnownFor(
        newActor2.id,
        newActor2.known_for
      );
    }

    return {
      actor1Obj: {
        ...actor1Obj,
        most_popular_recent_movie: actor1MostKnownFor,
      },
      actor2Obj: {
        ...actor2Obj,
        most_popular_recent_movie: actor2MostKnownFor,
      },
    };
  }
};
