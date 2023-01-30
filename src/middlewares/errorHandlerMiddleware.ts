import { NextFunction, Request, Response } from 'express';
import {
  DBInitializationError,
  FindGroupError,
  FindUserError,
} from '../customErrors';
import { logger } from '../logger/winstonLogger';

export const errorHandlerMiddleware = function (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof Error) {
    if (err instanceof DBInitializationError) {
      logger.error(err.message);
      res.status(500).send(err.message);
      process.exit(1);
    } else if (err instanceof FindUserError) {
      logger.error(err.message);
      res.status(404).send(err.message);
      next();
    } else if (err instanceof FindGroupError) {
      logger.error(err.message);
      res.status(404).send(err.message);
      next();
    } else {
      logger.error(err.message);
      res.status(500).send(err.message);
      next();
    }
  } else {
    logger.error(err);
    res.status(500).send('Unknown error');
    next();
  }
};
