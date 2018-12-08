import { Middleware } from 'koa';
import { ContainerInstance, Container, ObjectType, Token } from 'typedi';
import { checkRequestMessage,
         respondSuccess,
         respondFail,
         Response,
         MethodInstance } from '@jtrpc/core';

export type MethodResolver = (method: string) => ObjectType<any> | Token<any> | string | { service: any;} | undefined;

export interface Config {
  container?: typeof Container | ContainerInstance;
  methodResolver?: MethodResolver;
}

/**
 * @todo check body parser exsited
 */
export function createMiddleware({
  container = Container,
  methodResolver = (method => method),
}: Config = {}): Middleware {

  return async (ctx, next) => {
    if (ctx.request.method.toLocaleLowerCase() !== 'post') {
      return next();
    }

    const request = ctx.request.body;
    
    if (!checkRequestMessage(request)) {
      ctx.body = respondFail(null, Response.ErrorCode.InvalidRequest, 'invalid request', ctx.body);
      return next();
    }

    const identity = methodResolver(request.method) || request.method;

    const method = container.get(<any> identity);

    if (!method || !(method instanceof MethodInstance)) {
      ctx.body = respondFail(request.id, Response.ErrorCode.MethodNotFound, 'method not found', request.method);
      return next();
    }

    let args: any[];

    if (Array.isArray(request.params)) {
      args = request.params;
    } else {
      args = [request.params];
    }

    if (!method.validateParameters(...args)) {
      ctx.body = respondFail(request.id, Response.ErrorCode.InvalidParams, 'invalid params', request.params);
      return next();
    }

    try {
      const result = await method.execute(...args);    
      ctx.body = respondSuccess(request.id, result);
    } catch (error) {
      ctx.body = respondFail(
        request.id,
        Response.ErrorCode.InternalError,
        error.message || 'internal error',
        error
      );
    }

    return next();
  };
}

export default createMiddleware;
