import axios from "axios";

export const handleUpdateEmotes = async (id: string, emote: string) => {
  const updateObj = {
    id,
    emote,
  };

  const nodeEnv = process.env.REACT_APP_NODE_ENV
    ? process.env.REACT_APP_NODE_ENV
    : "";

  return await axios
    .post(
      nodeEnv && nodeEnv === "production"
        ? `${process.env.REACT_APP_PROD_SERVER}/api/update_emotes`
        : "http://localhost:4000/api/update_emotes",
      updateObj,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .catch((e) => console.error(e));
};
