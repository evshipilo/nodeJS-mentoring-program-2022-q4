import { NextFunction, Request, Response } from 'express';

export const methodLoggerMiddleware = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  // res.on('finish', () => {
    console.log(
      'LOGGED>>>> request method: ',
      req.method,
      'request params: ',
      req.params,
      'request body: ',
      req.body,
      'request query: ',
      req.query
    );
  // });
  next();
};
