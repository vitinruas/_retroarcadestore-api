import {
  IHttpRequest,
  IHttpResponse
} from 'src/presentation/protocols/http-protocol'
import { SignUpController } from './signup-controller'

describe('SignUpController', () => {
  test('should return 400 if no name is provided', () => {
    const sut: SignUpController = new SignUpController()
    const request: IHttpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const response: IHttpResponse = sut.perform(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toBe('Missing param: name')
  })

  test('should return 400 if no email is provided', () => {
    const sut: SignUpController = new SignUpController()
    const request: IHttpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const response: IHttpResponse = sut.perform(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toBe('Missing param: email')
  })

  test('should return 400 if no password is provided', () => {
    const sut: SignUpController = new SignUpController()
    const request: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password'
      }
    }
    const response: IHttpResponse = sut.perform(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toBe('Missing param: password')
  })

  test('should return 400 if no passwordConfirmation is provided', () => {
    const sut: SignUpController = new SignUpController()
    const request: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const response: IHttpResponse = sut.perform(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toBe('Missing param: passwordConfirmation')
  })
})
