import { Middleware } from 'koa';
import { ContainerInstance, Container } from 'typedi';
import { checkRequestMessage,
         respondSuccess,
         respondFail,
         Response,
         MethodInstance } from '@jtrpc/core';

export interface Config {
  container?: typeof Container | ContainerInstance,
}

/**
 * @todo check body parser exsited
 */
export default function jtrpc({
  container = Container,
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

    const method: MethodInstance<any, any> = container.get(request.method);

    if (!method) {
      ctx.body = respondFail(request.id, Response.ErrorCode.MethodNotFound, 'method not found', request.method);
      return next();
    }

    if (!method.validateParameters(request.params)) {
      ctx.body = respondFail(request.id, Response.ErrorCode.InvalidParams, 'invalid params', request.params);
      return next();
    }

    let args: any[];

    if (Array.isArray(request.params)) {
      args = request.params;
    } else {
      args = [request.params];
    }

    try {
      const result = await method.execute(...args);    
      ctx.body = respondSuccess(request.id, result);
      return next();
    } catch (error) {
      ctx.body = respondFail(
        request.id,
        Response.ErrorCode.InternalError,
        error.message || 'internal error',
        error
      );
      return next();
    }
  };
}
