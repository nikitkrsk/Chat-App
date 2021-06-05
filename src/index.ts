import { createConnection, getConnectionOptions } from "typeorm";
import express from "express";

import cors from "cors";
import router from "./routes";
import dbConfig from "./ormconfig";

// Connects to the Database -> then starts the express
createConnection(dbConfig).then(async (connection) => {
  // Create a new express application instance
  const app = express();

  // Call midlewares
  app.use(cors());

  // A lot of projects use / Now is depricated  - not supported
  // import bodyParser from "body-parser";
  // app.use(bodyParser.json());
  app.use(express.json());

  // Set all routes from routes folder
  app.use("/", router);
  
  // read connection options from ormconfig file (or ENV variables)
  // const connectionOptions = await getConnectionOptions();

  // Run migrations if any - TypeORM stuff
  try {
    await connection.runMigrations();
  } catch (error) {
    throw new Error(error);
  }

  app.listen(3000);
});
