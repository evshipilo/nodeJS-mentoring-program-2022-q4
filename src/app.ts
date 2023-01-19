import express from 'express';
import "reflect-metadata";
import cors from 'cors';
import * as dotenv from 'dotenv'
import user from './routers/user';
import group from './routers/group';
import { methodLogger } from './middlewares/methodLogger';
import { errorsLogger } from './middlewares/unhandledErrorsLogger';
import { errorHandler } from './middlewares/errorHandler';
import {processListener} from './process'
const app = express();
dotenv.config()

// Enable Cross Origin Resource Sharing to all origins by default
app.use(cors());
// Transforms the raw string of req.body into json
app.use(express.json());
//load common middlewares
app.use(methodLogger);
// Load API routes
app.use(user, group);
//Load errors Logger
app.use(errorsLogger);

app.use(errorHandler);



app.listen(process.env.PORT);

processListener();