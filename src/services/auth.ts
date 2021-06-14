import { getRepository, Repository } from "typeorm";
import redis from "redis"
import JWTR from "jwt-redis"

import { ChatUser, Role, Status } from "../entity";
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

export default class UserService {
  /**
   * [signin checking user input, checking user status, creates token,
   * refresh token, setting seession in Redis, and sending logged in event]
   * @param  {[ISigninInput]} input ['email, password' properties]
   * @return {[Promise<IResponse<ISigninSuccess>>]}      [returns the user, token and refresh token]
   */
  public static signin = async (
    input: ISigninInput,
  ): Promise<IResponse<ISigninSuccess>> => {
    // Email to lower case
    input.email = input.email.toLowerCase().trim();
    const userRepository: Repository<ChatUser> = getRepository(ChatUser);
    const statusRepository: Repository<Status> = getRepository(Status);
    // JWT REDIS FOR TOKEN
    const redisClient = redis.createClient();
    const jwtr = new JWTR(redisClient);
    // GET USER AND ADMIN
    const user: ChatUser = await userRepository.findOne({
      where: { email: input.email },
      relations: ["status", "role"],
    });
    if (user === undefined) {
      return {
        error: { code: 400, msg: "Invalid credentials" },
      };
    }

    // Compare Passwords
    const passwordsMatch = passwordHash.verify(input.password, user.password);
    if (!passwordsMatch) {
      return {
        error: { code: 400, msg: "Invalid credentials" },
      };
    }
    // Check if User Account is blocked
    const statusActive: Status = await statusRepository.findOne({
      where: { name: "active" },
    });
    if (user.status.name !== statusActive.name) {
      return {
        error: {
          code: 403,
          msg: "Account is Blocked, Please Contanct the Administrator",
        },
      };
    }

    const JWTData = {
      uuid: user.uuid,
      role: user.role.name,
      jti: user.uuid
    };
    const token = await jwtr.sign(JWTData, process.env.JWT_KEY!,  { expiresIn: "30s" })

    delete user.password;
    return { result: { user, token } };
  };
}
