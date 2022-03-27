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
      type: string
    ) => {
      return {
        name,
        id,
        image: `https://image.tmdb.org/t/p/w1280${image_path}`,
        type,
      };
    };
    const actor1Obj = createActorObject(
      newActor1.name,
      newActor1.id,
      newActor1.profile_path,
      "first"
    );
    const actor2Obj = createActorObject(
      newActor2.name,
      newActor2.id,
      newActor2.profile_path,
      "last"
    );

    return {
      actor1Obj,
      actor2Obj,
    };
  }
};
