import { updateActors } from "./updateActors";
import { Actor } from "../models/Actor";

export const updateDatabaseActors = async () => {
  const resultActors = await updateActors();
  const firstActorFilter = { type: "first" };
  const firstActorUpdate = resultActors.actor1Obj;
  // Update first actor
  await Actor.findOneAndUpdate(firstActorFilter, firstActorUpdate);

  const lastActorFilter = { type: "last" };
  const lastActorUpdate = resultActors.actor2Obj;
  // Update last actor
  await Actor.findOneAndUpdate(lastActorFilter, lastActorUpdate);
  console.log(
    `Successfully updated first and last actors for ${new Date().toLocaleDateString()}!`
  );
};
