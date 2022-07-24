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
      body: request.body
    }

    const httpResponse: IHttpResponse = await controller.perform(httpRequest)
    if (httpResponse.statusCode >= 400) {
      return response
        .status(httpResponse.statusCode)
        .json(httpResponse.body.message)
        .send()
    }
    return response
      .status(httpResponse.statusCode)
      .json(httpResponse.body)
      .send()
  }
}
