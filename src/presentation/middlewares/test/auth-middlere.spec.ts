import { ICheckAccessTokenUseCase } from '../../../domain/usecases/account/check-access-token-usecase'
import { AccessDeniedError } from '../../errors'
import { forbidden } from '../../helpers/http-response-helper'
import { IHttpRequest, IHttpResponse } from '../../protocols/http-protocol'
import { AuthMiddleware } from '../auth-middleware'

const makeFakeValidRequest = (): IHttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
})

const makeCheckAccessTokenUseCaseStub = (): ICheckAccessTokenUseCase => {
  class CheckAccessTokenUseCaseStub implements ICheckAccessTokenUseCase {
    async check(accessToken: string, admin?: boolean): Promise<string> {
      return Promise.resolve('any_id')
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
  const sut = new AuthMiddleware(checkAccessTokenUseCaseStub, true)
  return {
    sut,
    checkAccessTokenUseCaseStub
  }
}

describe('AuthMiddleware', () => {
  test('should return 403 if no access token is provided', async () => {
    const { sut }: ISut = makeSut()

    const httpResponse: IHttpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should call CheckAccessTokenUseCase with an access token', async () => {
    const { sut, checkAccessTokenUseCaseStub }: ISut = makeSut()
    const check = jest.spyOn(checkAccessTokenUseCaseStub, 'check')

    await sut.handle(makeFakeValidRequest())

    expect(check).toHaveBeenCalledWith('any_token')
  })
})
