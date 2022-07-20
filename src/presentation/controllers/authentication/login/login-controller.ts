import { InvalidFieldError, MissingFieldError } from '../../../errors'
import { badRequest } from '../../../helpers/http-response-helper'
import {
  IController,
  IEmailValidatorAdapter,
  IHttpRequest,
  IHttpResponse
} from '../signup/signup-controller-protocols'

export class LoginController implements IController {
  constructor(private readonly emailValidator: IEmailValidatorAdapter) {}

  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.body.email) {
      return badRequest(new MissingFieldError('email'))
    }
    if (!httpRequest.body.password) {
      return badRequest(new MissingFieldError('password'))
    }

    try {
      const isValid = this.emailValidator.validate(httpRequest.body.email)
      if (!isValid) {
        return badRequest(new InvalidFieldError('email'))
      }
    } catch (error) {}
    return Promise.resolve({
      statusCode: 200,
      body: null
    })
  }
}
