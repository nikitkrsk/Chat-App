import { ChatUser } from "../entity";

export interface ISigninInput {
  email: string;
  password: string;
}

export interface ISigninSuccess {
  user: ChatUser;
  token: string;
  session: string;
}
export interface IDestroySelf {
  uuid: string;
  sessionId: string;
}
export interface IDestroySuccess {
  message: string;
}

export interface IDestroyAdmin {
  sessionId: string;
}
