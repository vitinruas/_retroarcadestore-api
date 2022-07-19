import { MissingFieldError } from '../../errors/missing-field-error'
import { InvalidFieldError } from '../../errors/invalid-field-error'
import { badRequest, ok } from '../../helpers/http-response-helper'
import { IController } from '../../protocols/controller-protocol'
import {
  IHttpRequest,
  IHttpResponse
} from 'src/presentation/protocols/http-protocol'
import { IEmailValidator } from 'src/presentation/protocols/email-validator-protocol'

export class SignUpController implements IController {
  constructor(private readonly emailValidatorStub: IEmailValidator) {}

  perform(httpRequest: IHttpRequest): IHttpResponse {
    // check if all required fields has been provided
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const requiredField of requiredFields) {
      if (!httpRequest.body[requiredField]) {
        return badRequest(new MissingFieldError(requiredField))
      }
    }

    // check if passwords match
    if (httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
      return badRequest(new InvalidFieldError('passwordConfirmation'))
    }

    const isValid = this.emailValidatorStub.validate(httpRequest.body.email)

    if (!isValid) {
      return badRequest(new InvalidFieldError('email'))
    }

    return ok()
  }
}
