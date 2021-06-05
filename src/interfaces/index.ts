interface Error {
    code: number;
    msg: string;
  }
  
  export interface IResponse<T> {
    result?: T;
    error?: Error;
  }
  