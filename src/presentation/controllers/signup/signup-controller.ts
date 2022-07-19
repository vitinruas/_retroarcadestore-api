import { MissingParamError } from '../../errors/missing-param-error'
import { badRequest, ok } from '../../helpers/http-response-helper'
import { IController } from '../../protocols/controller-protocol'
import {
  IHttpRequest,
  IHttpResponse
} from 'src/presentation/protocols/http-protocol'

export class SignUpController implements IController {
  perform(httpRequest: IHttpRequest): IHttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const requiredField of requiredFields) {
      if (!httpRequest.body[requiredField]) {
        return badRequest(new MissingParamError(requiredField))
      }
    }
    return ok()
  }
}
