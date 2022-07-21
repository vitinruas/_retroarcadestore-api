import { ServerError } from '../errors/server-error'
import { IHttpResponse } from '../protocols/http-protocol'

export const badRequest = (error: Error): IHttpResponse => ({
  statusCode: 400,
  body: error
})

export const forbidden = (error: Error): IHttpResponse => ({
  statusCode: 403,
  body: error
})

export const unauthorized = (error: Error): IHttpResponse => ({
  statusCode: 401,
  body: error
})

export const ok = (data?: any): IHttpResponse => ({
  statusCode: 200,
  body: data
})

export const serverError = (error: Error): IHttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})
