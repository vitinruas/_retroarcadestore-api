import {
  badRequest,
  noContent,
  serverError
} from '../../../helpers/http-response-helper'
import {
  IController,
  IEmailValidatorAdapter,
  IUpdateClientUseCase,
  IHttpRequest,
  IHttpResponse
} from './update-client-controller-protocols'
import { NoFieldProvidedError, InvalidFieldError } from '../../../errors'

export class UpdateClientController implements IController {
  constructor(
    private readonly emailValidatorAdapter: IEmailValidatorAdapter,
    private readonly updateClientUseCase: IUpdateClientUseCase
  ) {}

  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      // check if anything field was provided
      if (Object.keys(httpRequest.body).length) {
        // check if an email was provided
        if (httpRequest.body.email) {
          // check if the provided email is valid
          const isValid: boolean = this.emailValidatorAdapter.validate(
            httpRequest.body.email
          )
          if (!isValid) {
            return badRequest(new InvalidFieldError('email'))
          }
        }
        // update client data
        await this.updateClientUseCase.update({ ...httpRequest.body })
        return noContent()
      }
      return badRequest(new NoFieldProvidedError())
    } catch (error: any) {
      return serverError(error)
    }
  }
}
