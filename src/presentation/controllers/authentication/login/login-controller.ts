import { MissingFieldError } from '../../../errors'
import { badRequest } from '../../../helpers/http-response-helper'
import {
  IController,
  IHttpRequest,
  IHttpResponse
} from '../signup/signup-controller-protocols'

export class LoginController implements IController {
  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.body.email) {
      return badRequest(new MissingFieldError('email'))
    }
    if (!httpRequest.body.password) {
      return badRequest(new MissingFieldError('password'))
    }
    return Promise.resolve({
      statusCode: 200,
      body: null
    })
  }
}
