import { getRepository, Repository } from "typeorm";
import { ChatUser, Group } from "./entity";
import { Server } from "socket.io";
import JWTR from "jwt-redis";
import redis from "redis";
import { getConnection } from "typeorm";

import { EMITS } from "./interfaces";
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
          console.log({ checkOk: socket.decoded });
          next();
        } catch (err) {
          socket.decoded = EMITS.UNAUTHORIZED;
          // tslint:disable-next-line
          console.log({ checkFailed: socket.decoded, err });
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
          () => socket.emit(EMITS.UNAUTHORIZED, `LOgOUT`),
          Math.abs(
            new Date(socket.decoded.exp * 1000).getTime() - new Date().getTime()
          )
        );
        const userRepository: Repository<ChatUser> = getRepository(ChatUser);
        const groupRepository: Repository<Group> = getRepository(Group);

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

        // Group Created
        socket.on("groupCreated", async (data) => {
          if (user.username) {
            console.log(data);
            // data.user = user;
            // socket.emit("messageSuccess", {});
            const group: Group = new Group();
            group.title = data.title;
            group.description = data.description;
            group.private = data.private;
            group.lastActive = new Date();
            group.users = [user];
            try {
              await groupRepository.save(group);
            } catch (e) {
              // console.log(e.message);
              return socket.emit("savingGroupError", "Couldn't Save Group");
            }

            if (!data.private) {
              socket.broadcast.emit("newPublicChatCreated", group);
            } else {
              data.users.forEach(async (userInData) => {
                socket
                  .to(userInData)
                  .emit("newChatWasCreated", "you was added to new group");
                const userInGroup: ChatUser = await userRepository.findOne({
                  where: { username: userInData },
                });
                await getConnection()
                  .createQueryBuilder()
                  .relation(ChatUser, "groups")
                  .of(userInGroup)
                  .add(group);
              });
            }
          }
        });

        // // Message
        // socket.on("message", async (data) => {
        //   if (user.email) {
        //     data.user = user;
        //     socket.emit("messageSuccess", {});
        //     let group: Group = await groupRepository.findOne({
        //       where: { uuid: data.groupUuid },
        //     });

        //     let msg = {
        //       text: data.text,
        //       from_id: data.from_id,
        //     };
        //     if (data.to_id) {
        //       msg.to_id = data.to_id;
        //     }
        //     // Message.create(msg);
        //     if (data.to_id) {
        //       io.to(data.to_id).emit("message", data);
        //       io.to(data.from_id).emit("message", data);
        //     } else {
        //       io.emit("message", data);
        //     }
        //   }
        // });
      }
    });
  }

  emiter(event: EMITS, body) {
    // tslint:disable-next-line
    console.log(body);
    if (body) this.io.emit(event, body);
  }
}
