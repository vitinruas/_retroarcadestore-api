import { NoFieldProvidedError } from '../../../errors/no-field-provided'
import { badRequest, ok } from '../../../helpers/http-response-helper'
import {
  IController,
  IHttpRequest,
  IHttpResponse
} from '../get/get-client-controller-protocols'

export class UpdateClientController implements IController {
  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
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

    return Promise.resolve(ok())
  }
}
