import { createConnection, getConnectionOptions } from "typeorm";
import express from "express";
// import { Server } from "socket.io";

import cors from "cors";
import router from "./routes";
import dbConfig from "./ormconfig";

import * as http from "http";
import { SocketService } from "./socket";

// Connects to the Database -> then starts the express
createConnection(dbConfig).then(async (connection) => {
  const port = process.env.PORT;

  // Create a new express application instance
  const app = express();
  // set up socket.io and bind it to our
  // http server.
  const server = http.createServer(app);
  // const io = new Server(server);

  // Call midlewares
  app.use(cors());

  // A lot of projects use / Now is depricated  - not supported
  // import bodyParser from "body-parser";
  // app.use(bodyParser.json());
  app.use(express.json());

  // Set all routes from routes folder
  app.use("/", router);

  // sockets(io);
  app.set("socketService", new SocketService(server));

  // read connection options from ormconfig file (or ENV variables)
  // const connectionOptions = await getConnectionOptions();

  // Run migrations if any - TypeORM stuff
  try {
    await connection.runMigrations();
  } catch (error) {
    throw new Error(error);
  }
  // tslint:disable-next-line
  server.listen(port, () => console.log(`Server is running on port ${port}`));
});
