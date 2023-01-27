import { NextFunction, Request, Response } from 'express';
import {
  DBInitializationError,
  FindGroupError,
  FindUserError,
} from '../customErrors';
import { log } from './winstonLogger';

export const errorHandler = function (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof Error) {
    if (err instanceof DBInitializationError) {
      log.error(err.message);
      res.status(500).send(err.message);
      process.exit(1);
    }
    if (err instanceof FindUserError) {
      log.error(err.message);
      res.status(404).send(err.message);
      next();
      return
    }
    if (err instanceof FindGroupError) {
      log.error(err.message);
      res.status(404).send(err.message);
      next();
      return
    }
    log.error(err.message);
    res.status(500).send(err.message);
    next();
  } else {
    log.error('Unknown error');
    res.status(500).send('Unknown error');
    next();
  }
};
