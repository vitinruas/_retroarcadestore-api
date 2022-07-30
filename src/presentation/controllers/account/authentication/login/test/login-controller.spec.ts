import { LoginController } from '../login-controller'
import { UnauthenticatedLoginError } from '../../../../../errors/unauthenticated-error'
import {
  ok,
  serverError,
  unauthorized
} from '../../../../../helpers/http-response-helper'
import {
  IValidation,
  IHttpRequest,
  IHttpResponse,
  IAuthenticationUseCase,
  IAuthenticationModel
} from '../login-controller-protocols'

const makeFakeValidRequest = (): IHttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeValidationCompositeStub = (): IValidation => {
  class ValidationCompositeStub implements IValidation {
    async validate(fields: any): Promise<void | Error> {
      return Promise.resolve()
    }
  }
  return new ValidationCompositeStub()
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
  validationCompositeStub: IValidation
  authenticationUseCaseStub: IAuthenticationUseCase
}

const makeSut = (): ISut => {
  const validationCompositeStub: IValidation = makeValidationCompositeStub()
  const authenticationUseCaseStub: IAuthenticationUseCase =
    makeAuthenticationUseCaseStub()
  const sut: LoginController = new LoginController(
    validationCompositeStub,
    authenticationUseCaseStub
  )
  return {
    sut,
    validationCompositeStub,
    authenticationUseCaseStub
  }
}

describe('LoginController', () => {
  test('should call ValidationComposite with correct values', async () => {
    const { sut, validationCompositeStub }: ISut = makeSut()
    const validateSpy = jest.spyOn(validationCompositeStub, 'validate')
    const httpRequest: IHttpRequest = makeFakeValidRequest()

    await sut.perform(makeFakeValidRequest())

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
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
