import { ok, serverError } from '../../../../helpers/http-response-helper'
import {
  IHttpRequest,
  IHttpResponse,
  IGetClientUseCase,
  IClientEntitie
} from '../get-client-controller-protocols'
import { GetClientController } from '../get-client-controller'

const makeFakeValidRequest = (): IHttpRequest => ({
  body: {
    uid: 'any_uid'
  }
})

const makeFakeValidAccount = (): IClientEntitie => ({
  uid: 'any_uid',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  accessToken: 'any_token'
})

const makeGetClientUseCaseStub = (): IGetClientUseCase => {
  class GetClientUseCaseStub implements IGetClientUseCase {
    get(uid: string): Promise<IClientEntitie> {
      return Promise.resolve(makeFakeValidAccount())
    }
  }
  return new GetClientUseCaseStub()
}

interface ISut {
  sut: GetClientController
  GetClientUseCaseStub: IGetClientUseCase
}

const makeSut = (): ISut => {
  const GetClientUseCaseStub: IGetClientUseCase = makeGetClientUseCaseStub()
  const sut = new GetClientController(GetClientUseCaseStub)
  return {
    sut,
    GetClientUseCaseStub
  }
}

describe('GetClientUseCase', () => {
  test('should call GetClientUseCase with an uid', async () => {
    const { sut, GetClientUseCaseStub } = makeSut()
    const getSpy = jest.spyOn(GetClientUseCaseStub, 'get')

    await sut.perform(makeFakeValidRequest())

    expect(getSpy).toHaveBeenCalledWith('any_uid')
  })

  test('should return 500 if GetClientUseCase throws', async () => {
    const { sut, GetClientUseCaseStub } = makeSut()
    jest.spyOn(GetClientUseCaseStub, 'get').mockImplementationOnce(async () => {
      return Promise.reject(new Error())
    })

    const httpResponse: IHttpResponse = await sut.perform(
      makeFakeValidRequest()
    )

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return an account on success', async () => {
    const { sut } = makeSut()

    const httpResponse: IHttpResponse = await sut.perform(
      makeFakeValidRequest()
    )

    expect(httpResponse).toEqual(ok(makeFakeValidAccount()))
  })
})
