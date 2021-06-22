import JWTR from "jwt-redis";
import { Request } from "express";
export * from "./auth"
export * from "./user"
export * from "./socketEmits"
export * from "./roles"
export * from "./group"
interface Error {
  code: number;
  msg: string;
}

export interface IResponse<T> {
  result?: T;
  error?: Error;
}


export interface IGetUserAuthInfoRequest extends Request {
  role: string;
  uuid: string;
}

export interface IJWTDecode extends JWTR {
  role: string;
  uuid: string;
}