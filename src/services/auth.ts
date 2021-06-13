import { getRepository, Repository } from "typeorm";
import { ChatUser, Admin, Refresh, Role, Status } from "../entity";
import {
  IRefreshInput,
  IRefreshSuccess,
  IResponse,
  ISigninInput,
  ISigninSuccess,
  ISignoutInput,
  ISignoutSuccess,
} from "../interfaces";
import passwordHash from "password-hash";

import * as jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";
import { sessionQueue } from "../queues/session";

export default class UserService {
  /**
   * [signin checking user input, checking user status, creates token,
   * refresh token, setting seession in Redis, and sending logged in event]
   * @param  {[ISigninInput]} input ['email, password' properties]
   * @return {[Promise<IResponse<ISigninSuccess>>]}      [returns the user, token and refresh token]
   */
  public static signin = async (
    input: ISigninInput
  ): Promise<IResponse<ISigninSuccess>> => {
    // Email to lower case
    input.email = input.email.toLowerCase().trim();
    const userRepository: Repository<ChatUser> = getRepository(ChatUser);
    const adminRepository: Repository<Admin> = getRepository(Admin);
    const statusRepository: Repository<Status> = getRepository(Status);
    const refreshRepository: Repository<Refresh> = getRepository(Refresh);

    const user: ChatUser = await userRepository.findOne({
      where: { email: input.email },
      relations: ["status", "role"],
    });
    const admin: Admin = await adminRepository.findOne({
      where: { email: input.email },
      relations: ["status", "role"],
    });
    if (user === undefined && admin === undefined) {
      return {
        error: { code: 400, msg: "Invalid credentials" },
      };
    }
    const exUser = user ?? admin;

    // Compare Passwords
    const passwordsMatch = passwordHash.verify(input.password, exUser.password);
    if (!passwordsMatch) {
      return {
        error: { code: 400, msg: "Invalid credentials" },
      };
    }
    // Check if User Account is blocked
    const statusActive: Status = await statusRepository.findOne({
      where: { name: "active" },
    });
    if (exUser.status.name !== statusActive.name) {
      return {
        error: {
          code: 403,
          msg: "Account is Blocked, Please Contanct the Administrator",
        },
      };
    }

    const JWTData = {
      uuid: exUser.uuid,
      role: exUser.role.name,
    };
    const token = jwt.sign(JWTData, process.env.JWT_KEY!, { expiresIn: "30s" });
    // Refresh token creation
    const refreshToken = jwt.sign(JWTData, process.env.JWT_KEY!, {
      expiresIn: "1m",
    });
    const refresh = new Refresh();
    refresh.refreshToken = refreshToken;
    refresh.email = exUser.email;
    refresh.user = user ?? null;
    refresh.admin = admin ?? null;
    try {
      await refreshRepository.save(refresh);
    } catch (e) {
      return {
        error: {
          code: 500,
          msg: `Something Went Wrong`,
        },
      };
    }
    sessionQueue.add(
      { refreshToken },
      // the same time as refresh token in millis
      {
        delay: 1000 * 60, // 1m to do 1h add "* 60"
      }
    );

    delete exUser.password;
    return { result: { user: exUser, token, refreshToken } };
  };
}
