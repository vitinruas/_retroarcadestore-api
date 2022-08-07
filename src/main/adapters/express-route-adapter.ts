import { Request, Response } from 'express'
import { IController } from '../../presentation/protocols/controller-protocol'
import {
  IHttpRequest,
  IHttpResponse
} from '../../presentation/protocols/http-protocol'

export const expressRouteAdapter = (controller: IController) => {
  return async (request: Request, response: Response) => {
    const httpRequest: IHttpRequest = {
      headers: request.headers,
      body: request.body,
      ip: request.ip,
      userAgent: request.get('user-agent'),
      route: request.route.path,
      file: request.file,
      files: request.files
    }
    const httpResponse: IHttpResponse = await controller.perform(httpRequest)
    console.log(httpResponse)
    if (httpResponse.statusCode >= 400) {
      return response
        .status(httpResponse.statusCode)
        .json(httpResponse.body.message)
    }
    return response.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
