import { InvalidFieldError, MissingFieldError } from '../../../../errors'
import {
  badRequest,
  serverError
} from '../../../../helpers/http-response-helper'
import {
  IHttpRequest,
  IHttpResponse
} from '../../../../protocols/http-protocol'
import { IEmailValidatorAdapter } from '../../signup/signup-controller-protocols'
import { LoginController } from '../login-controller'

const makeFakeValidRequest = (): IHttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeEmailValidatorAdapterStub = (): IEmailValidatorAdapter => {
  class EmailValidatorAdapterStub implements IEmailValidatorAdapter {
    validate(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorAdapterStub()
}

interface ISut {
  sut: LoginController
  emailValidatorAdapterStub: IEmailValidatorAdapter
}

const makeSut = (): ISut => {
  const emailValidatorAdapterStub: IEmailValidatorAdapter =
    makeEmailValidatorAdapterStub()
  const sut: LoginController = new LoginController(emailValidatorAdapterStub)
  return {
    sut,
    emailValidatorAdapterStub
  }
}

describe('LoginController', () => {
  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: IHttpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse: IHttpResponse = await sut.perform(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingFieldError('email')))
  })

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: IHttpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }

    const httpResponse: IHttpResponse = await sut.perform(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingFieldError('password')))
  })

  test('should call EmailValidatorAdapter with an email', async () => {
    const { sut, emailValidatorAdapterStub } = makeSut()
    const validateSpy = jest.spyOn(emailValidatorAdapterStub, 'validate')

    await sut.perform(makeFakeValidRequest())

    expect(validateSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return 500 if EmailValidatorAdapter throws', async () => {
    const { sut, emailValidatorAdapterStub } = makeSut()
    jest
      .spyOn(emailValidatorAdapterStub, 'validate')
      .mockImplementationOnce(() => {
        throw new Error()
      })

    const httpResponse: IHttpResponse = await sut.perform(
      makeFakeValidRequest()
    )

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorAdapterStub } = makeSut()
    jest.spyOn(emailValidatorAdapterStub, 'validate').mockReturnValueOnce(false)

    const httpResponse: IHttpResponse = await sut.perform(
      makeFakeValidRequest()
    )

    expect(httpResponse).toEqual(badRequest(new InvalidFieldError('email')))
  })
})
