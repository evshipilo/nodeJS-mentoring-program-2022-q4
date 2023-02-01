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
  if (!(err instanceof Error)) {
    // something absolutely unexpected happened
    logger.error(`Unexpected instance of error. Given error type: ${typeof err}`);
    res.status(500).send('Unknown error');
    next();
  }
  
  logger.error(err.message);

  if (err instanceof DBInitializationError) {
      res.status(500).send(err.message);
      process.exit(1);
    } else if ((err instanceof FindUserError) || (err instanceof FindGroupError)) {
      res.status(404).send(err.message);
    } else {
      res.status(500).send(err.message);
    }
    next();
};
