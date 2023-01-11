import { NextFunction, Request, Response } from "express";

export const methodLogger = (req: Request, res: Response, next: NextFunction) => {
    res.on("finish", function() {
      console.log(req.method);
    });
    next();
  };