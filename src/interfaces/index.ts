import {ChatUser} from "../entity"

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
}

export interface ISigninSuccess {
  user: ChatUser ;
  token: string;
}

export interface ISignoutInput {
  email: string;
}

export interface IRefreshSuccess {
  message: string;
  token: string;
}
export interface ISignoutSuccess {
  message: string;
}
