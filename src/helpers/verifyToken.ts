import { Request, Response, NextFunction } from "express";
import JWTR from "jwt-redis";
import redis from "redis";
import { IGetUserAuthInfoRequest, IJWTDecode } from "../interfaces";

/**
 * Middleware to check if user has valid jwt.
 */
export const verifyToken = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  /* tslint:disable:no-string-literal */
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const redisClient = redis.createClient();
  const jwtr = new JWTR(redisClient);

  if (token == null) return res.sendStatus(401);
  try {
    const user: IJWTDecode = await jwtr.verify(token, process.env.JWT_KEY);
    req.role = user.role;
    req.uuid = user.uuid;
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};
