import { format } from "date-fns";
import { TwitterApi } from "twitter-api-v2";
import { Actor } from "../models/Actor";

export const postToTwitter = async () => {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_KEY_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });

  const currentDate = format(new Date(), "MM/dd/yyyy");
  const actors =
    (await Actor.find({ date: currentDate }).catch((e) => console.error(e))) ||
    [];
  const fullWordDate = format(new Date(), "LLLL do, yyyy");
  const foundFirstActor = actors.find((el) => el.type === "first");
  const actor1Name = foundFirstActor ? foundFirstActor.name : actors[0]?.name;
  const foundLastActor = actors.find((el) => el.type === "last");
  const actor2Name = foundLastActor ? foundLastActor.name : actors[1]?.name;

  if (client) {
    if (actor1Name && actor2Name) {
      await client.v2
        .tweet(
          `The ${fullWordDate} Hollywoodle game features ${actor1Name} and ${actor2Name}. Can you find the fewest degrees of separation between them? Make the connection at https://hollywoodle.ml.`
        )
        .then(async () => {
          console.log(
            `Successfully posted ${currentDate} Hollywoodle tweet to Twitter @hollywoodlegame!`
          );
        })
        .catch(async (e) => {
          console.error(
            "Something went wrong when trying to post today's Tweet!"
          );
          console.error(e);
        });
    } else {
      console.log(
        "Missing either actor 1 name or actor 2 name! Can't post tweet to Twitter!"
      );
    }
  } else {
    console.log("No Twitter client is available!");
  }
};
