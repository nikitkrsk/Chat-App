import { getRepository, Repository } from "typeorm";
import { ChatUser } from "./entity";
import { Server } from "socket.io";
import JWTR from "jwt-redis";
import redis from "redis";

import { EMITS } from "./interfaces/socketEmits";
export class SocketService {
  io;
  constructor(server) {
    this.io = new Server(server);
    this.io.use(async (socket, next) => {
      if (socket.handshake.query && socket.handshake.query.token) {
        let payload;
        // JWT REDIS FOR TOKEN
        const redisClient = redis.createClient();
        const jwtr = new JWTR(redisClient);
        try {
          payload = await jwtr.verify(
            socket.handshake.query.token,
            process.env.JWT_KEY
          );
          socket.decoded = payload;
          // tslint:disable-next-line
          console.log({ decodedJWT: socket.decoded });
          next();
        } catch (err) {
          socket.decoded = EMITS.UNAUTHORIZED;
          // tslint:disable-next-line
          console.log({ decodedJWT: socket.decoded, err });
          next();
        }
      } else {
        socket.decoded = EMITS.UNAUTHORIZED;
        next();
        // next(new Error("Authentication error"));
        // return socket.disconnect(true);
      }
    });
    this.io.on("connection", async (socket) => {
      // jwt payload of the connected client
      // tslint:disable-next-line
      //   console.log(socket.decoded);
      if (socket.decoded === EMITS.UNAUTHORIZED) {
        socket.emit(EMITS.UNAUTHORIZED, `LOGOUT`);
      } else {
        setTimeout(
          () => socket.emit(EMITS.LOGIN, `LOgOUT`),
          Math.abs(
            new Date(socket.decoded.exp * 1000).getTime() - new Date().getTime()
          )
        );
        const userRepository: Repository<ChatUser> = getRepository(ChatUser);
        const user: ChatUser = await userRepository.findOne({
          where: { uuid: socket.decoded.uuid },
        });
        if (user === undefined) {
          // tslint:disable-next-line
          console.log("user not found");
        }
        // tslint:disable-next-line
        //   console.log(user);
        socket.emit(EMITS.LOGIN, `Hi ${user.username}`);
        socket.broadcast.emit(EMITS.LOGIN, user.username);
        socket.join(user.username);
      }

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
  }

  emiter(event: EMITS, body) {
    // tslint:disable-next-line
    console.log(body);
    if (body) this.io.emit(event, body);
  }
}
