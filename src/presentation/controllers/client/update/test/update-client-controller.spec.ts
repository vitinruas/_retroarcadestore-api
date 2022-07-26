import { NoFieldProvidedError } from '../../../../errors/no-field-provided'
import { badRequest } from '../../../../helpers/http-response-helper'
import {
  IHttpRequest,
  IHttpResponse
} from '../../get/get-client-controller-protocols'
import { UpdateClientController } from '../update-client-controller'

describe('UpdateClientController', () => {
  test('should return 400 if no field is provided', async () => {
    const sut = new UpdateClientController()
    const httpRequest: IHttpRequest = {
      body: {}
    }
    const httpResponse: IHttpResponse = await sut.perform(httpRequest)
    expect(httpResponse).toEqual(badRequest(new NoFieldProvidedError()))
  })
})
