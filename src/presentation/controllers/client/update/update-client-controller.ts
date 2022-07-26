import {
  IController,
  IEmailValidatorAdapter,
  IUpdateClientUseCase,
  IHttpRequest,
  IHttpResponse
} from './update-client-controller-protocols'
import {
  badRequest,
  noContent,
  serverError
} from '../../../helpers/http-response-helper'
import { NoFieldProvidedError, InvalidFieldError } from '../../../errors'

export class UpdateClientController implements IController {
  constructor(
    private readonly emailValidatorAdapter: IEmailValidatorAdapter,
    private readonly updateClientUseCase: IUpdateClientUseCase
  ) {}

  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { email, file, postalCode } = httpRequest.body
    try {
      const httpRequestKeys: ReadonlyArray<string> = Object.keys(
        httpRequest.body
      )
      // check if anything field was provided
      if (httpRequestKeys.length) {
        if (file) {
          Object.assign(httpRequest.body, {
            photo: httpRequest.body.file.filename
          })
        }
        // check if provided postal code is valid and has a valid length
        if (postalCode) {
          if (
            !Number(httpRequest.body.postalCode) ||
            httpRequest.body.postalCode.length > 10 ||
            httpRequest.body.postalCode.length < 5
          ) {
            return badRequest(new InvalidFieldError('postalCode'))
          }
        }
        // check if an email was provided
        if (email) {
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
