import "dotenv/config";
import { format } from "date-fns";
import { TwitterApi } from "twitter-api-v2";
import { Actor } from "../models/Actor";
import { logger } from "../logger/logger";
import { parseISO, subHours, compareAsc } from "date-fns";

export const postToTwitter = async () => {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_KEY_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });

  const hollywoodleTweets = (await client.v2.userTimeline(
    "1543774130826346498",
    {
      exclude: "replies",
      "tweet.fields": ["created_at"],
    }
  )) as any;

  if (hollywoodleTweets) {
    if (hollywoodleTweets._realData) {
      if (hollywoodleTweets._realData.data) {
        const mostRecentTweet = hollywoodleTweets._realData.data[0];
        if (mostRecentTweet) {
          const mostRecentTimePosted = parseISO(mostRecentTweet.created_at);
          const twoHoursAgo = subHours(new Date(), 2);

          // Returns -1 if tweet was made more than two hours ago and 1 if most recent tweet was made less than two hours ago
          const comparison = compareAsc(mostRecentTimePosted, twoHoursAgo);

          if (comparison === -1) {
            const currentDate = format(new Date(), "MM/dd/yyyy");
            const actors =
              (await Actor.find({ date: currentDate }).catch((e) =>
                console.error(e)
              )) || [];
            const fullWordDate = format(new Date(), "LLLL do, yyyy");
            const foundFirstActor = actors.find((el) => el.type === "first");
            const actor1Name = foundFirstActor
              ? foundFirstActor.name
              : actors[0]?.name;
            const foundLastActor = actors.find((el) => el.type === "last");
            const actor2Name = foundLastActor
              ? foundLastActor.name
              : actors[1]?.name;

            if (client) {
              if (actor1Name && actor2Name) {
                await client.v2
                  .tweet(
                    `The ${fullWordDate} Hollywoodle game features ${actor1Name} and ${actor2Name}. Can you find the fewest degrees of separation between them? Make the connection at https://hollywoodle.ml.`
                  )
                  .then(async () => {
                    const successStatement = `Successfully posted ${currentDate} Hollywoodle tweet to Twitter @hollywoodlegame!`;
                    if (process.env.NODE_ENV === "production") {
                      logger("server").info(successStatement);
                    } else {
                      console.log(successStatement);
                    }
                  })
                  .catch(async (e) => {
                    const errStatement = `Something went wrong when trying to post today's Tweet: ${e}`;
                    if (process.env.NODE_ENV === "production") {
                      logger("server").error(errStatement);
                    } else {
                      console.error(errStatement);
                    }
                  });
              } else {
                const missingInfo =
                  "Missing either actor 1 name or actor 2 name! Can't post tweet to Twitter!";
                if (process.env.NODE_ENV === "production") {
                  logger("server").info(missingInfo);
                } else {
                  console.log(missingInfo);
                }
              }
            } else {
              const noClient = "No Twitter client is available!";
              if (process.env.NODE_ENV === "production") {
                logger("server").error(noClient);
              } else {
                console.error(noClient);
              }
            }
          } else {
            const alreadyPostedStatement =
              "Already posted in the last two hours!";
            if (process.env.NODE_ENV === "production") {
              logger("server").error(alreadyPostedStatement);
            } else {
              console.error(alreadyPostedStatement);
            }
            return;
          }
        } else {
          const couldntFindStatement = "Couldn't find most recent tweet!";
          if (process.env.NODE_ENV === "production") {
            logger("server").error(couldntFindStatement);
          } else {
            console.error(couldntFindStatement);
          }
          return;
        }
      }
    }
  }
};
