import { createConnection, getConnectionOptions } from "typeorm";
import express from "express";
import { Server } from "socket.io";
import * as socketio from "socket.io";
import * as path from "path";

import cors from "cors";
import router from "./routes";
import dbConfig from "./ormconfig";

import * as http from "http";

// Connects to the Database -> then starts the express
createConnection(dbConfig).then(async (connection) => {
  const port = process.env.PORT;

  // Create a new express application instance
  const app = express();
  // set up socket.io and bind it to our
  // http server.
  const server = http.createServer(app);
  const io = new Server(server);
  // Call midlewares
  app.use(cors());

  // A lot of projects use / Now is depricated  - not supported
  // import bodyParser from "body-parser";
  // app.use(bodyParser.json());
  app.use(express.json());

  // Set all routes from routes folder
  app.use("/", router);

  // Call socket and show time every second
  let interval;
  io.on("connection", (socket) => {
    console.log("New client connected");
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 1000);
    socket.on("disconnect", () => {
      console.log("Client disconnected");
      clearInterval(interval);
    });
  });

  const getApiAndEmit = (socket) => {
    const response = new Date();
    // Emitting a new message. Will be consumed by the client
    socket.emit("FromAPI", response);
  };
  // read connection options from ormconfig file (or ENV variables)
  // const connectionOptions = await getConnectionOptions();

  // Run migrations if any - TypeORM stuff
  try {
    await connection.runMigrations();
  } catch (error) {
    throw new Error(error);
  }

  server.listen(port, () => console.log(`Server is running on port ${port}`));
});
