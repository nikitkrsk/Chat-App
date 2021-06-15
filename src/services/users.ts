import { getRepository, Repository } from "typeorm";
import { Role, Status, ChatUser } from "../entity";
import { IResponse } from "../interfaces";
import passwordHash from "password-hash";
import { UserCreate, UserUpdate } from "../interfaces/admin";
import { SocketService } from "../socket";
import { EMITS } from "../interfaces/socketEmits";
import { ROLES } from "../interfaces/roles";
export default class AdminService {
  public static getAllUsers = async (
    usersType: ROLES
  ): Promise<IResponse<ChatUser[]>> => {
    const userRepository: Repository<ChatUser> = getRepository(ChatUser);
    const roleRepository: Repository<Role> = getRepository(Role);

    const role: Role = await roleRepository.findOne({
      where: { name: usersType },
    });
    const admins = await userRepository.find({
      where: { role },
      order: {
        createdAt: "DESC",
      },
      join: {
        alias: "admin",
        leftJoinAndSelect: {
          role: "admin.role",
          status: "admin.status",
          sessions: "admin.sessions"
        },
      },
    });

    if (admins === undefined) {
      return { error: { code: 404, msg: "No Records" } };
    }
    if (admins.length === 0) {
      return { error: { code: 204, msg: "No Records" } };
    }
    return {
      result: admins,
    };
  };

  public static createUser = async (
    input: UserCreate,
    roleInput: ROLES
  ): Promise<IResponse<ChatUser>> => {
    const userRepository: Repository<ChatUser> = getRepository(ChatUser);
    const statusRepository: Repository<Status> = getRepository(Status);
    const roleRepository: Repository<Role> = getRepository(Role);

    const checkAdminExist: ChatUser = await userRepository.findOne({
      where: { email: input.email },
    });

    if (checkAdminExist !== undefined) {
      return {
        error: { code: 409, msg: "User with this email already exists" },
      };
    }

    const status = await statusRepository.findOne({
      where: { name: "active" },
    });

    const role: Role = await roleRepository.findOne({
      where: { name: roleInput },
    });
    if (role === undefined) {
      return {
        error: { code: 409, msg: "Incorrect Role" },
      };
    }
    const adminVerified = roleInput === ROLES.ADMIN ? {
      verifiedAt : new Date(),
      verified: true
    }: null

    let user: ChatUser = new ChatUser();
    user = {
      ...user,
      ...input,
      ...adminVerified,
      status,
      role,
      password: passwordHash.generate(input.password),
    };

    try {
      await userRepository.save(user);
    } catch (e) {
      return {
        error: { code: 500, msg: "Something went wrong" },
      };
    }

    delete user.password;
    return { result: user };
  };

  public static updateUser = async (
    input: UserUpdate,
    uuid: string,
    socketService: SocketService
  ): Promise<IResponse<ChatUser>> => {
    const userRepository: Repository<ChatUser> = getRepository(ChatUser);
    const statusRepository: Repository<Status> = getRepository(Status);
    const roleRepository: Repository<Role> = getRepository(Role);

    let user: ChatUser = await userRepository.findOne({
      where: { uuid },
    });

    if (user === undefined) {
      return {
        error: { code: 404, msg: "User with such id doesn't exists" },
      };
    }

    const status =
      (await statusRepository.findOne({
        where: { name: input.status },
      })) ?? user.status;

    const role: Role =
      (await roleRepository.findOne({
        where: { name: input.role },
      })) ?? user.role;

    socketService.emiter(EMITS.UPDATE_ACCOUNT, "UpdateAccount");

    const password: string = input.password ?? user.password;
    user = {
      ...user,
      ...input,
      status,
      role,
      password: user.password,
    };

    try {
      await userRepository.save(user);
    } catch (e) {
      return {
        error: { code: 500, msg: "Something went wrong" },
      };
    }

    delete user.password;
    return { result: user };
  };
}
