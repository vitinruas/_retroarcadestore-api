import { InvalidFieldError } from '../../../errors'
import { NoFieldProvidedError } from '../../../errors/no-field-provided'
import {
  badRequest,
  ok,
  serverError
} from '../../../helpers/http-response-helper'
import { IEmailValidatorAdapter } from '../../../protocols/email-validator-protocol'
import {
  IController,
  IHttpRequest,
  IHttpResponse
} from '../get/get-client-controller-protocols'

export class UpdateClientController implements IController {
  constructor(private readonly emailValidatorAdapter: IEmailValidatorAdapter) {}
  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const upgradableClientFields: ReadonlyArray<string> = [
        'name',
        'email',
        'password',
        'photo'
      ]
      const upgradableClientAddressFields: ReadonlyArray<string> = [
        'street',
        'postalCode',
        'complement',
        'district',
        'city',
        'country'
      ]
      const clientFieldsToUpdate: ReadonlyArray<string> =
        upgradableClientFields.filter((field: string) => {
          return httpRequest.body[field]
        })

      const addressFieldsToUpdate: ReadonlyArray<string> =
        upgradableClientAddressFields.filter((field: string) => {
          return httpRequest.body[field]
        })

      if (!clientFieldsToUpdate.length && !addressFieldsToUpdate.length) {
        return badRequest(new NoFieldProvidedError())
      }

      const isValid: boolean = this.emailValidatorAdapter.validate(
        httpRequest.body.email
      )
      if (!isValid) {
        return badRequest(new InvalidFieldError('email'))
      }

      return Promise.resolve(ok())
    } catch (error: any) {
      return serverError(error)
    }
  }
}
