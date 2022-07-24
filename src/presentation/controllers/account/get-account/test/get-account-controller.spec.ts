import { IGetAccountUseCase } from '../../../../../domain/usecases/account/get-account-usecase'
import { serverError } from '../../../../helpers/http-response-helper'
import { IAccountEntitie } from '../../../../middlewares/auth-middleware-protocols'
import {
  IHttpRequest,
  IHttpResponse
} from '../../authentication/login/login-controller-protocols'
import { GetAccountController } from '../get-account-controller'

const makeFakeValidRequest = (): IHttpRequest => ({
  body: {
    id: 'any_id'
  }
})

const makeGetAccountUseCaseStub = (): IGetAccountUseCase => {
  class GetAccountUseCaseStub implements IGetAccountUseCase {
    get(id: string): Promise<IAccountEntitie> {
      return Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'hashed_password',
        accessToken: 'any_token'
      })
    }
  }
  return new GetAccountUseCaseStub()
}

interface ISut {
  sut: GetAccountController
  getAccountUseCaseStub: IGetAccountUseCase
}

const makeSut = (): ISut => {
  const getAccountUseCaseStub: IGetAccountUseCase = makeGetAccountUseCaseStub()
  const sut = new GetAccountController(getAccountUseCaseStub)
  return {
    sut,
    getAccountUseCaseStub
  }
}

describe('GetAccountUseCase', () => {
  test('should call GetAccountUseCase with an user id', async () => {
    const { sut, getAccountUseCaseStub } = makeSut()
    const getSpy = jest.spyOn(getAccountUseCaseStub, 'get')

    await sut.perform(makeFakeValidRequest())

    expect(getSpy).toHaveBeenCalledWith('any_id')
  })

  test('should return 500 if GetAccountUseCase throws', async () => {
    const { sut, getAccountUseCaseStub } = makeSut()
    jest
      .spyOn(getAccountUseCaseStub, 'get')
      .mockImplementationOnce(async () => {
        return Promise.reject(new Error())
      })

    const httpResponse: IHttpResponse = await sut.perform(
      makeFakeValidRequest()
    )

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
