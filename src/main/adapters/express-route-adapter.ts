import { Request, Response } from 'express'
import { IController } from 'src/presentation/protocols/controller-protocol'
import {
  IHttpRequest,
  IHttpResponse
} from 'src/presentation/protocols/http-protocol'
export const expressRouteAdapter = (controller: IController) => {
  return async (request: Request, response: Response) => {
    const httpRequest: IHttpRequest = {
      headers: request.headers,
      body: request.body
    }

    console.log(httpRequest)

    const httpResponse: IHttpResponse = await controller.perform(httpRequest)

    return response
      .status(httpResponse.statusCode)
      .json(httpResponse.body)
      .send()
  }
}
