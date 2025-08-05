import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import routes from './http/routes';
import { errorHandler } from './http/middlewares/errorHandler';

import './container';

dotenv.config();

const app: express.Application = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', routes);
app.use(errorHandler);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});

export default app;
