import { NextFunction, Request, Response } from 'express';

export const methodLogger = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.on('finish', () => {
    console.log('LOGGED>>>> request method: ', req.method);
    console.log('LOGGED>>>> request params: ', req.params);
    console.log('LOGGED>>>> request body: ', req.body);
    console.log('LOGGED>>>> request query: ', req.query);
  });
  next();
};
