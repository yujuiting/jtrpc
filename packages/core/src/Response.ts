export namespace Response {
  export enum ErrorCode {
    ParseError      = -32700,
    InvalidRequest  = -32600,
    MethodNotFound  = -32601,
    InvalidParams   = -32602,
    InternalError   = -32603,
    // -32000 ~ -32099 Server error.	Reserved for implementation-defined server-errors.
  }

  export interface Error<T = any> {
    code: number;
    message: string;
    data?: T;
  }

  export interface Success<T> extends Response {
    result: T;
  }

  export interface Fail<T> extends Response {
    error: Response.Error<T>;
  }
}

export interface Response {
  jsonrpc: '2.0';
  result?: any;
  error?: Response.Error;
  id: ID;
}

export function respondSuccess<T>(id: ID, result: T): Response.Success<T> {
  return {
    jsonrpc: '2.0',
    result,
    id,
  };
}

export function respondFail<T = any>(id: ID, code: number, message: string, data?: T): Response.Fail<T> {
  return {
    jsonrpc: '2.0',
    error: {
      code,
      message,
      data,
    },
    id,
  };
}