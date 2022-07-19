import { InvalidFieldError } from '../../errors/invalid-field-error'
import { MissingFieldError } from '../../errors/missing-field-error'
import { ServerError } from '../../errors/server-error'
import { IEmailValidator } from '../../protocols/email-validator-protocol'
import {
  IHttpRequest,
  IHttpResponse
} from 'src/presentation/protocols/http-protocol'
import { SignUpController } from './signup-controller'

interface ISut {
  sut: SignUpController
  emailValidatorStub: IEmailValidator
}
const makeSut = (): ISut => {
  class EmailValidatorStub implements IEmailValidator {
    validate(email: string): boolean {
      return true
    }
  }
  const emailValidatorStub: IEmailValidator = new EmailValidatorStub()
  const sut: SignUpController = new SignUpController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('SignUpController', () => {
  test('should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const request: IHttpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const response: IHttpResponse = sut.perform(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingFieldError('name'))
  })

  test('should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const request: IHttpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const response: IHttpResponse = sut.perform(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingFieldError('email'))
  })

  test('should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const request: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password'
      }
    }
    const response: IHttpResponse = sut.perform(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingFieldError('password'))
  })

  test('should return 400 if no passwordConfirmation is provided', () => {
    const { sut } = makeSut()
    const request: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const response: IHttpResponse = sut.perform(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingFieldError('passwordConfirmation'))
  })

  test('should return 400 if passwords do not match', () => {
    const { sut } = makeSut()
    const request: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    }
    const response: IHttpResponse = sut.perform(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidFieldError('passwordConfirmation'))
  })

  test('should call EmailValidator with an email', () => {
    const { sut, emailValidatorStub }: ISut = makeSut()
    const validateSpy = jest.spyOn(emailValidatorStub, 'validate')
    const request: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    sut.perform(request)
    expect(validateSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub }: ISut = makeSut()
    jest.spyOn(emailValidatorStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })
    const request: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse: IHttpResponse = sut.perform(request)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
