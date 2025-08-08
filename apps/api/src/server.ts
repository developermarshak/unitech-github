import "reflect-metadata";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import routes from "./http/routes/index.js";
import { errorHandler } from "./http/middlewares/errorHandler.js";

import "./container.js";

dotenv.config();

export function createApp(): express.Application {
  const app: express.Application = express();
  app.use(cors());
  app.use(bodyParser.json());

  app.use("/api", routes);

  // Error handling middleware should be last
  app.use(errorHandler);

  return app;
}

const app = createApp();
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});

export default app;
