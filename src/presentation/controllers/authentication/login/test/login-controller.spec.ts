import { MissingFieldError } from '../../../../errors'
import { badRequest } from '../../../../helpers/http-response-helper'
import {
  IHttpRequest,
  IHttpResponse
} from '../../../../protocols/http-protocol'
import { LoginController } from '../login-controller'

const makeValidRequest = (): IHttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

describe('LoginController', () => {
  test('should return 400 if no email is provided', async () => {
    const sut = new LoginController()
    const httpRequest: IHttpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse: IHttpResponse = await sut.perform(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingFieldError('email')))
  })

  test('should return 400 if no password is provided', async () => {
    const sut = new LoginController()
    const httpRequest: IHttpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const httpResponse: IHttpResponse = await sut.perform(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingFieldError('password')))
  })
})
