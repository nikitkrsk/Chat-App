import { getRepository, Repository } from "typeorm";
import redis from "redis";
import JWTR from "jwt-redis";
import crypto from "crypto";
import { sessionQueue } from "../queues/session";

import { ChatUser, Status, Session } from "../entity";
import {
  IResponse,
  ISigninInput,
  ISigninSuccess,
  IDestroySelf,
  IDestroySelfSuccess,
  ISignoutInput,
  ISignoutSuccess,
} from "../interfaces";
import passwordHash from "password-hash";

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
    const statusRepository: Repository<Status> = getRepository(Status);
    const sessionRepository: Repository<Session> = getRepository(Session);
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

    const session = new Session();
    session.loginStatus = true;
    session.jti = await crypto.randomBytes(20).toString("hex");
    session.user = user;
    session.ip = "metaHere";
    session.browser = "metaHere";
    try {
      await sessionRepository.save(session);
    } catch {
      return {
        error: { code: 500, msg: "Something went wrong" },
      };
    }
    const JWTData = {
      uuid: user.uuid,
      role: user.role.name,
      jti: session.jti,
    };
    const token = await jwtr.sign(JWTData, process.env.JWT_KEY!, {
      expiresIn: "1h",
    });
    sessionQueue.add(
      { jti: session.jti },
      // the same time as refresh token in millis
      {
        delay: 1000 * 60 * 60, // 1h
      }
    );

    delete user.password;
    return { result: { user, token } };
  };
  /**
   * [get uuid from token, get session uuid, deletes session]
   * @param  {[IDestroySelf]} input ['uuid, 'sessionId']
   * @return {[Promise<IResponse<IDestroySelfSuccess>>]}      [returns the user, token and refresh token]
   */
  public static selfDestroySession = async (
    input: IDestroySelf,
  ): Promise<IResponse<IDestroySelfSuccess>> => {
    // Email to lower case
    const userRepository: Repository<ChatUser> = getRepository(ChatUser);
    const sessionRepository: Repository<Session> = getRepository(Session);
    // JWT REDIS FOR TOKEN
    const redisClient = redis.createClient();
    const jwtr = new JWTR(redisClient);
    // GET USER AND ADMIN
    const user: ChatUser = await userRepository.findOne({
      where: { uuid: input.uuid },
    });
    if (user === undefined) {
      return {
        error: { code: 403, msg: "You Couldn't Perform This Action" },
      };
    }

    const session: Session = await sessionRepository.findOne({
      where: { uuid: input.sessionId },
    });
    if (session === undefined) {
      return {
        error: { code: 404, msg: "Session Not Found" },
      };
    }
    try {
      session.loginStatus = false;
      await sessionRepository.save(session);
      await jwtr.destroy(session.jti);
    } catch {
      return {
        error: { code: 500, msg: "Something went wrong" },
      };
    }
    return { result: { message: "Session Terminated" } };
  };
}
