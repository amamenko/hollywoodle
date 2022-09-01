import "dotenv/config";
import { Stats } from "request-stats";
import { logger } from "../logger/logger";

export const handleEventLog = (stats: Stats) => {
  const ip = stats.req.ip ? stats.req.ip.split(",")[0] : "";
  logger("server").info(
    `method=${stats.req.method} path="${stats.req.path}" ip="${ip}" status=${stats.res.status}`
  );
};
