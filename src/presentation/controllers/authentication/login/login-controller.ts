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
    try {
      // check if all required fields has been provided
      const requiredFields = ['email', 'password']
      for (const requiredField of requiredFields) {
        if (!httpRequest.body[requiredField]) {
          return badRequest(new MissingFieldError(requiredField))
        }
      }

      const { email } = httpRequest.body

      // check if the provided email is valid
      const isValid = this.emailValidator.validate(email)
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
