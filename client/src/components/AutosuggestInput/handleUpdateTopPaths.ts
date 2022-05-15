import axios from "axios";

export const handleUpdateTopPaths = async (
  path: string,
  currentDegrees: number
) => {
  const updateObj = {
    degrees: currentDegrees,
    path,
  };

  const nodeEnv = process.env.REACT_APP_NODE_ENV
    ? process.env.REACT_APP_NODE_ENV
    : "";

  return await axios
    .post(
      nodeEnv && nodeEnv === "production"
        ? `${process.env.REACT_APP_PROD_SERVER}/api/update_top_paths`
        : "http://localhost:4000/api/update_top_paths",
      updateObj,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .catch((e) => console.error(e));
};
