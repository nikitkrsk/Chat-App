import { createConnection, getConnectionOptions } from "typeorm";
import express from "express";
import { Server } from "socket.io";
import { authorize } from "@thream/socketio-jwt";

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
  io.use(
    authorize({
      secret: process.env.JWT_KEY,
    })
  );

  let interval;
  io.on("connection", async (socket) => {
    // jwt payload of the connected client
    // console.log(socket.decodedToken);
    const clients = await io.sockets.allSockets();
    if (clients != null) {
      for (const clientId of clients) {
        const client = io.sockets.sockets.get(clientId);
        if (interval) {
          clearInterval(interval);
        }
        interval = setInterval(() => getApiAndEmit(client), 1000);
        client?.emit("messages", { message: "Success!" });
        // we can access the jwt payload of each connected client
        console.log(client?.decodedToken);
      }
    }
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
