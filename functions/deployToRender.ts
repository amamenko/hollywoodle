import "dotenv/config";
import axios from "axios";
import { logger } from "../logger/logger";

export const deployToRender = async () => {
  await axios.get(process.env.RENDER_DEPLOY_HOOK).catch((e) => {
    if (e.response) {
      logger("server").info(JSON.stringify(e.response.data));
    }
  });
};
