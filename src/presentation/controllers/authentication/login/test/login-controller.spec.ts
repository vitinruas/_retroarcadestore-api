import { LoginController } from '../login-controller'
import { InvalidFieldError, MissingFieldError } from '../../../../errors'
import { UnauthenticatedLoginError } from '../../../../errors/unauthenticated-error'
import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '../../../../helpers/http-response-helper'
import {
  IEmailValidatorAdapter,
  IHttpRequest,
  IHttpResponse,
  IAuthenticationUseCase,
  IAuthenticationModel
} from '../login-controller-protocol'

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

const makeAuthenticationUseCaseStub = (): IAuthenticationUseCase => {
  class AuthenticationUseCaseStub implements IAuthenticationUseCase {
    async authenticate(
      authenticateData: IAuthenticationModel
    ): Promise<string | null> {
      return 'any_token'
    }
  }
  return new AuthenticationUseCaseStub()
}

interface ISut {
  sut: LoginController
  emailValidatorAdapterStub: IEmailValidatorAdapter
  authenticationUseCaseStub: IAuthenticationUseCase
}

const makeSut = (): ISut => {
  const emailValidatorAdapterStub: IEmailValidatorAdapter =
    makeEmailValidatorAdapterStub()
  const authenticationUseCaseStub: IAuthenticationUseCase =
    makeAuthenticationUseCaseStub()
  const sut: LoginController = new LoginController(
    emailValidatorAdapterStub,
    authenticationUseCaseStub
  )
  return {
    sut,
    emailValidatorAdapterStub,
    authenticationUseCaseStub
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

  test('should call AuthenticationUseCase with correct values', async () => {
    const { sut, authenticationUseCaseStub } = makeSut()
    const authenticateSpy = jest.spyOn(
      authenticationUseCaseStub,
      'authenticate'
    )

    await sut.perform(makeFakeValidRequest())

    expect(authenticateSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('should return 500 if AuthenticationUseCase throws', async () => {
    const { sut, authenticationUseCaseStub } = makeSut()
    jest
      .spyOn(authenticationUseCaseStub, 'authenticate')
      .mockImplementationOnce(async () => {
        return Promise.reject(new Error())
      })

    const httpResponse: IHttpResponse = await sut.perform(
      makeFakeValidRequest()
    )

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 401 if AuthenticationUseCase returns null', async () => {
    const { sut, authenticationUseCaseStub } = makeSut()

    jest
      .spyOn(authenticationUseCaseStub, 'authenticate')
      .mockReturnValueOnce(Promise.resolve(null))
    const httpResponse: IHttpResponse = await sut.perform(
      makeFakeValidRequest()
    )

    expect(httpResponse).toEqual(unauthorized(new UnauthenticatedLoginError()))
  })

  test('should return an access token if AuthenticationUseCase succeeds', async () => {
    const { sut } = makeSut()

    const httpResponse: IHttpResponse = await sut.perform(
      makeFakeValidRequest()
    )

    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })
})
