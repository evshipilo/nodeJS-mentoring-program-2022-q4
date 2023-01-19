import winston from 'winston';
import expressWinston from 'express-winston';

export const errorsLogger = expressWinston.errorLogger({
    transports: [
      new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.prettyPrint(),
      )
  })
