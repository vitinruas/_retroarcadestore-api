import { IHttpResponse } from '../protocols/http-protocol'

export const badRequest = (error: Error): IHttpResponse => ({
  statusCode: 400,
  body: error.message
})

export const ok = (data?: any): IHttpResponse => ({
  statusCode: 200,
  body: data
})
