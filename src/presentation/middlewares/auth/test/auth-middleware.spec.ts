import { AuthMiddleware } from '../auth-middleware'
import { forbidden, serverError } from '../../../helpers/http-response-helper'
import { AccessDeniedError } from '../../../errors'
import {
  IAccountEntitie,
  IHttpRequest,
  IHttpResponse,
  ICheckAccessTokenUseCase
} from '../auth-middleware-protocols'

const makeFakeValidRequest = (): IHttpRequest => ({
  ip: 'any_ip',
  route: 'any_route',
  userAgent: 'any_userAget',
  headers: {
    'x-access-token': 'any_token'
  }
})

const makeCheckAccessTokenUseCaseStub = (): ICheckAccessTokenUseCase => {
  class CheckAccessTokenUseCaseStub implements ICheckAccessTokenUseCase {
    async check(accessToken: string): Promise<IAccountEntitie | null> {
      return Promise.resolve({
        uid: 'any_uid',
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'hashed_password',
        accessToken: 'any_token'
      })
    }
  }
  return new CheckAccessTokenUseCaseStub()
}

interface ISut {
  sut: AuthMiddleware
  checkAccessTokenUseCaseStub: ICheckAccessTokenUseCase
}

const makeSut = (): ISut => {
  const checkAccessTokenUseCaseStub: ICheckAccessTokenUseCase =
    makeCheckAccessTokenUseCaseStub()
  const sut = new AuthMiddleware(checkAccessTokenUseCaseStub, false)
  return {
    sut,
    checkAccessTokenUseCaseStub
  }
}

describe('AuthMiddleware', () => {
  test('should return 403 if no access token is provided', async () => {
    const { sut }: ISut = makeSut()

    const httpResponse: IHttpResponse = await sut.handle({
      headers: {},
      ip: 'any_ip',
      route: 'any_route',
      userAgent: 'any_userAget'
    })

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should call CheckAccessTokenUseCase with an access token', async () => {
    const { sut, checkAccessTokenUseCaseStub }: ISut = makeSut()
    const check = jest.spyOn(checkAccessTokenUseCaseStub, 'check')

    await sut.handle(makeFakeValidRequest())

    expect(check).toHaveBeenCalledWith('any_token', false)
  })

  test('should return 500 if CheckAccessTokenUseCase throws', async () => {
    const { sut, checkAccessTokenUseCaseStub }: ISut = makeSut()
    jest
      .spyOn(checkAccessTokenUseCaseStub, 'check')
      .mockImplementation(async () => Promise.reject(new Error()))

    const httpResponse: IHttpResponse = await sut.handle(makeFakeValidRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 403 if CheckAccessTokenUseCase fails', async () => {
    const { sut, checkAccessTokenUseCaseStub }: ISut = makeSut()
    jest
      .spyOn(checkAccessTokenUseCaseStub, 'check')
      .mockReturnValueOnce(Promise.resolve(null))

    const httpResponse: IHttpResponse = await sut.handle(makeFakeValidRequest())

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should return 200 with account id if CheckAccessTokenUseCase succeeds', async () => {
    const { sut }: ISut = makeSut()

    const httpResponse: IHttpResponse = await sut.handle(makeFakeValidRequest())

    expect(httpResponse.body).toEqual({ uid: 'any_uid' })
  })
})
