import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv'
import user from './routes/user';
const app = express();
dotenv.config()

// Enable Cross Origin Resource Sharing to all origins by default
app.use(cors());
// Transforms the raw string of req.body into json
app.use(express.json());
// Load API routes
app.use(user);

app.listen(process.env.PORT);

