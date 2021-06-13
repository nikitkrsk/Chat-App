import { createConnection, getConnectionOptions } from "typeorm";
import express from "express";
import { Server } from "socket.io";
import { authorize } from "@thream/socketio-jwt";

import cors from "cors";
import router from "./routes";
import dbConfig from "./ormconfig";

import * as http from "http";

import { getRepository, Repository } from "typeorm";
import { ChatUser, Admin } from "./entity";
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

  io.on("connection", async (socket) => {
    // jwt payload of the connected client
    console.log(socket.decodedToken);
    const userRepository: Repository<ChatUser> = getRepository(ChatUser);
    const adminRepository: Repository<Admin> = getRepository(Admin);
    const user: ChatUser = await userRepository.findOne({
      where: { uuid: socket.decodedToken.uuid },
    });
    const admin: Admin = await adminRepository.findOne({
      where: { uuid: socket.decodedToken.uuid },
    });
    if (user === undefined && admin === undefined) {
      console.log("user not found");
    }
    const exUser = user ?? admin;

    console.log(exUser);
    socket.emit("login", `Hi ${exUser.username}`);
    socket.broadcast.emit("login", exUser.username);
    socket.join(exUser.username);
    // Message
    // socket.on('message', (data) => {
    //     if (exUser.email) {
    //       data.from_id = exUser.email;
    //       socket.emit('messageSuccess', {});
    //       let msg = {
    //         text: data.text,
    //         from_id: data.from_id
    //       };
    //       if (data.to_id) {
    //         msg.to_id = data.to_id;
    //       }
    //       // Message.create(msg);
    //       if (data.to_id) {
    //         io.to(data.to_id).emit('message', data);
    //         io.to(data.from_id).emit('message', data);
    //       } else {
    //         io.emit('message', data);
    //       }
    //     }
    // });
  });

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
