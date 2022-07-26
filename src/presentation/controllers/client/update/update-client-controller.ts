import { NoFieldProvidedError } from '../../../errors/no-field-provided'
import { badRequest, ok } from '../../../helpers/http-response-helper'
import {
  IController,
  IHttpRequest,
  IHttpResponse
} from '../get/get-client-controller-protocols'

export class UpdateClientController implements IController {
  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const upgradableClientFields = ['name', 'email', 'password', 'photo']
    const upgradableClientAddressFields = [
      'street',
      'postalCode',
      'complement',
      'district',
      'city',
      'country'
    ]
    const clientFieldsToUpdate = upgradableClientFields.filter(
      (field: string) => {
        return httpRequest.body[field]
      }
    )
    const addressFieldsToUpdate = upgradableClientAddressFields.filter(
      (field: string) => {
        return httpRequest.body[field]
      }
    )

    if (!clientFieldsToUpdate.length && !addressFieldsToUpdate.length) {
      return badRequest(new NoFieldProvidedError())
    }

    return Promise.resolve(ok())
  }
}
