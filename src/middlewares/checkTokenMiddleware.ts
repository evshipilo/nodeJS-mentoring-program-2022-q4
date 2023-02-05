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
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        res.status(403).json({ message: 'Failed jwt token' });
      } else {
        next();
      }
    });
  }else {res.status(401).json({ message: 'No jwt token provided' });}
};
