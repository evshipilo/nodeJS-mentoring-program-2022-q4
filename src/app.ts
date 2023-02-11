import express from 'express';
import "reflect-metadata";
import cors from 'cors';
import * as dotenv from 'dotenv'
import user from './routers/user';
import group from './routers/group';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware';
import {processListener} from './process'
import { loggerMiddleware } from './middlewares/loggerMiddleware';
import { logger } from './logger/winstonLogger';
import { checkTokenMiddleware } from './middlewares/checkTokenMiddleware';

const app = express();
dotenv.config()

// Enable Cross Origin Resource Sharing to all origins by default
app.use(cors());
// Transforms the raw string of req.body into json
app.use(express.json());
//load common middlewares
app.use(loggerMiddleware, checkTokenMiddleware);
// Load API routes
app.use(user, group);

//load error handler
app.use(errorHandlerMiddleware);

app.listen(process.env.PORT, () => {
  logger.info(`App listening at http://localhost:${process.env.PORT}`)
  });

//handle unhandled errors  
processListener();