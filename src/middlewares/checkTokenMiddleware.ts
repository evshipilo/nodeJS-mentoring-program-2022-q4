import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { JWTValidationError, NoJWTError } from '../customErrors';

export const checkTokenMiddleware = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(req.path)
  if(req.path === '/user/login') return next()

  const token = typeof req.headers['jwt-access-token'] === 'string' ? req.headers['jwt-access-token'] : undefined ;

  if (token) {
    const secret = process.env.SECRET as string;
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        throw new JWTValidationError('Failed jwt token')
      } else {
        next();
      }
    });
  }else {
    throw new NoJWTError('No jwt token provided')
  }
};
