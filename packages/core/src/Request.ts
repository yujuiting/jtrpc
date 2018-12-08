import { isObject } from './utils';

export type ArrayParams = any[];

export type ObjectParams = { [key: string]: any };

export interface Request {
  jsonrpc: '2.0';
  method: string;
  params: ArrayParams | ObjectParams;
  id: ID;
}

export interface Notification extends Request {
  id: null;
}

export function checkRequestMessage(request: unknown): request is Request {
  if (!isObject(request)) {
    return false;
  }

  if ((<Request> request).jsonrpc !== '2.0') {
    return false;
  }

  if (typeof (<Request> request).method !== 'string') {
    return false;
  }

  if (!Array.isArray((<Request> request).params) ||
      !isObject((<Request> request).params)) {
    return false;
  }

  if (typeof (<Request> request).id !== 'string' &&
      typeof (<Request> request).id !== 'number' &&
      (<Request> request).id !== null) {
    return false;
  }

  return true;
}