import {ChatUser, Admin} from "../entity"

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

export interface IRefreshInput {
  email: string;
  uuid: string;
  refreshToken: string;
}

export interface ISigninSuccess {
  user: ChatUser | Admin;
  token: string;
  refreshToken: string;
}

export interface ISignoutInput {
  email: string;
  refreshToken: string;
}

export interface IRefreshSuccess {
  message: string;
  token: string;
}
export interface ISignoutSuccess {
  message: string;
}
