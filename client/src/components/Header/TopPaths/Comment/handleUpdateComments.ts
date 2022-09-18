import axios from "axios";
import { getGeolocationData } from "../../../AutosuggestInput/getGeolocationData";

export const handleUpdateComments = async (
  pathId: string,
  userId: string,
  comment: string,
  emoji: string,
  background: string
) => {
  const { countryCode, city } = await getGeolocationData();

  const updateObj = {
    pathId,
    userId,
    comment,
    emoji,
    background,
    country: countryCode,
    city,
  };

  const nodeEnv = process.env.REACT_APP_NODE_ENV
    ? process.env.REACT_APP_NODE_ENV
    : "";

  return await axios
    .post(
      nodeEnv && nodeEnv === "production"
        ? `${process.env.REACT_APP_PROD_SERVER}/api/update_comments`
        : "http://localhost:4000/api/update_comments",
      updateObj,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .catch((e) => console.error(e));
};
