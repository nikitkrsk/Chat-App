import {ChatUser} from "../entity"
import JWTR from "jwt-redis";
import { Request } from "express";

interface Error {
  code: number;
  msg: string;
}

export interface IResponse<T> {
  result?: T;
  error?: Error;
}
export interface ISigninInput {
  email: string;
  password: string;
}

export interface ISigninSuccess {
  user: ChatUser ;
  token: string;
}

export interface ISignoutInput {
  email: string;
}
export interface ISignoutSuccess {
  message: string;
}

export interface IDestroySelf {
  uuid: string;
  sessionId: string;
}
export interface IDestroySelfSuccess {
  message: string;
}

export interface IGetUserAuthInfoRequest extends Request {
  role: string;
  uuid: string;
}

export interface IJWTDecode extends JWTR {
  role: string;
  uuid: string;
}