import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export const checkTokenMiddleware = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers['jwt-access-token'] as string;

  if (token) {
    const secret = process.env.SECRET as string;
    jwt.verify(token, secret, function (err) {
      if (err) {
        return res.status(401).json({ message: 'Failed jwt token' });
      } else {
        return next();
      }
    });
  }
};
