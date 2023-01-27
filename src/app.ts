import express from 'express';
import "reflect-metadata";
import cors from 'cors';
import * as dotenv from 'dotenv'
import user from './routers/user';
import group from './routers/group';
import { errorHandler } from './middlewares/errorHandler';
import {processListener} from './process'
import { morganMiddleware } from './middlewares/morgan.middleware';
import { log } from './middlewares/winstonLogger';
const app = express();
dotenv.config()

// Enable Cross Origin Resource Sharing to all origins by default
app.use(cors());
// Transforms the raw string of req.body into json
app.use(express.json());
//load common middlewares
app.use(morganMiddleware);
// Load API routes
app.use(user, group);

//load error handler
app.use(errorHandler);



app.listen(process.env.PORT, () => {
    log.info(`App listening at http://localhost:${process.env.PORT}`)
  });

processListener();