import { authorize } from "@thream/socketio-jwt";
import { getRepository, Repository } from "typeorm";
import { ChatUser, Admin } from "./entity";
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
      const adminRepository: Repository<Admin> = getRepository(Admin);
      const user: ChatUser = await userRepository.findOne({
        where: { uuid: socket.decodedToken.uuid },
      });
      const admin: Admin = await adminRepository.findOne({
        where: { uuid: socket.decodedToken.uuid },
      });
      if (user === undefined && admin === undefined) {
        // tslint:disable-next-line
        console.log("user not found");
      }
      const exUser = user ?? admin;
      // tslint:disable-next-line
      console.log(exUser);
      socket.emit(EMITS.LOGIN, `Hi ${exUser.username}`);
      socket.broadcast.emit(EMITS.LOGIN, exUser.username);
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
  }

  emiter(event: EMITS, body) {
    // tslint:disable-next-line
    console.log(body);
    if (body) this.io.emit(event, body);
  }
}
