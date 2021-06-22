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
  IDestroyAdmin,
  IDestroySuccess,
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
      expiresIn: "15m",
    });
    sessionQueue.add(
      { jti: session.jti },
      // the same time as refresh token in millis
      {
        delay: 1000 * 60 * 15 , // 1h
      }
    );

    delete user.password;
    return { result: { user, token, session: session.uuid } };
  };

  /**
   * [get uuid from token, return all sessions]
   * @param  {[IDestroySelf]} uuid ['uuid]
   * @return {[Promise<IResponse<Session[]>>]}[returns Sessions[]]
   */
  public static selfSessions = async (
    uuid: string
  ): Promise<IResponse<Session[]>> => {
    const userRepository: Repository<ChatUser> = getRepository(ChatUser);
    const sessionRepository: Repository<Session> = getRepository(Session);

    const user: ChatUser = await userRepository.findOne({
      where: { uuid },
    });
    if (user === undefined) {
      return {
        error: { code: 404, msg: "Not Found" },
      };
    }
    const sessions: Session[] = await sessionRepository.find({
      where: { user },
      order: {
        createdAt: "DESC",
      },
    });

    if (sessions === undefined) {
      return { error: { code: 404, msg: "No Records" } };
    }
    if (sessions.length === 0) {
      return { error: { code: 204, msg: "No Records" } };
    }
    return {
      result: sessions,
    };
  };

  /**
   * [get uuid from token, return all sessions]
   * @param  {[IDestroySelf]} uuid ['uuid]
   * @return {[Promise<IResponse<Session[]>>]}[returns chat users with Sessions[]]
   */
  public static allSessions = async (): Promise<IResponse<ChatUser[]>> => {
    const userRepository: Repository<ChatUser> = getRepository(ChatUser);

    const sessions = await userRepository.find({
      select: ["email", "username"],
      order: {
        createdAt: "DESC",
      },
      join: {
        alias: "users",
        leftJoinAndSelect: {
          sessions: "users.sessions"
        },
      },
    });

    if (sessions === undefined) {
      return { error: { code: 404, msg: "No Records" } };
    }
    if (sessions.length === 0) {
      return { error: { code: 204, msg: "No Records" } };
    }
    return {
      result: sessions,
    };
  };

  /**
   * [get uuid from token, get session uuid, deletes session]
   * @param  {[IDestroySelf]} input ['uuid, 'sessionId']
   * @return {[Promise<IResponse<IDestroySelfSuccess>>]}      [returns  Session Terminated]
   */
  public static selfDestroySession = async (
    input: IDestroySelf
  ): Promise<IResponse<IDestroySuccess>> => {
    const userRepository: Repository<ChatUser> = getRepository(ChatUser);
    const sessionRepository: Repository<Session> = getRepository(Session);
    // JWT REDIS FOR TOKEN
    const redisClient = redis.createClient();
    const jwtr = new JWTR(redisClient);
    // GET USER
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

  /**
   * [get uuid from token, get session uuid, deletes session]
   * @param  {[IDestroyAdmin]} input ['sessionId']
   * @return {[Promise<IResponse<IDestroySuccess>>]}      [returns  Session Terminated]
   */
  public static adminDestroySessions = async (
    input: IDestroyAdmin
  ): Promise<IResponse<IDestroySuccess>> => {
    const sessionRepository: Repository<Session> = getRepository(Session);
    // JWT REDIS FOR TOKEN
    const redisClient = redis.createClient();
    const jwtr = new JWTR(redisClient);

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
