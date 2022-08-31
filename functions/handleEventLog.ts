import { Stats } from "request-stats";

export const handleEventLog = (stats: Stats) => {
  console.log(
    `method=${stats.req.method} path="${stats.req.path}" ip="${stats.req.ip}" status=${stats.res.status}`
  );
};
