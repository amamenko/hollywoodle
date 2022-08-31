import { Stats } from "request-stats";

export const handleEventLog = (stats: Stats) => {
  const ip = stats.req.ip ? stats.req.ip.split(",")[0] : "";
  console.log(
    `method=${stats.req.method} path="${stats.req.path}" ip="${ip}" status=${stats.res.status}`
  );
};
