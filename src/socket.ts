import { authorize } from "@thream/socketio-jwt";
import { getRepository, Repository } from "typeorm";
import { ChatUser } from "./entity";
import { Server } from "socket.io";
import { EMITS } from "./interfaces/socketEmits"
export class SocketService {
  io: Server;
  constructor(server) {
    this.io = new Server(server);
    this.io.use(
      authorize({
        secret: process.env.JWT_KEY,
      })
    );
    this.io.on("connection", async (socket) => {
      // jwt payload of the connected client
      // tslint:disable-next-line
      console.log(socket.decodedToken);
      const userRepository: Repository<ChatUser> = getRepository(ChatUser);
      const user: ChatUser = await userRepository.findOne({
        where: { uuid: socket.decodedToken.uuid },
      });
      if (user === undefined) {
        // tslint:disable-next-line
        console.log("user not found");
      }
      // tslint:disable-next-line
      console.log(user);
      socket.emit(EMITS.LOGIN, `Hi ${user.username}`);
      socket.broadcast.emit(EMITS.LOGIN, user.username);
      socket.join(user.username);
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
