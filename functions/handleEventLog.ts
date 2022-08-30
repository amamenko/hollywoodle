import { Request, Response } from "express";

export const handleEventLog = (req: Request, res: Response) => {
  res.on("finish", () => {
    console.log(
      `method=${req.method} path="${req.url}" ip="${req.ip}" status=${res.statusCode}`
    );
  });
};
