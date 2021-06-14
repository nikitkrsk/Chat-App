import { Request, Response, NextFunction } from "express";
import JWTR from "jwt-redis";
import redis from "redis";

export interface IGetUserAuthInfoRequest extends Request {
    role: string // or any other type
  }
export const verifyToken = (
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

  jwtr.verify(token, process.env.JWT_KEY as string, (err: any, user: any) => {
    // console.log(err);
    // console.log(user);
    if (err) return res.sendStatus(403);
    req.role = user.role
    // res.setHeader( "role", user.role );
    next();
  });
};
