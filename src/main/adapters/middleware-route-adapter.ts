import { NextFunction, Request, Response } from 'express'
import { IMiddleware } from '../../presentation/protocols/middleware-protocol'
import {
  IHttpRequest,
  IHttpResponse
} from '../../presentation/protocols/http-protocol'
export const middlewareRouteAdapter = (middleware: IMiddleware) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const httpRequest: IHttpRequest = {
      headers: request.headers
    }

    const httpResponse: IHttpResponse = await middleware.handle(httpRequest)
    if (httpResponse.statusCode === 200) {
      Object.assign(request, { body: httpResponse.body })
      return next()
    }
    return response
      .status(httpResponse.statusCode)
      .json(httpResponse.body.message)
      .send()
  }
}
