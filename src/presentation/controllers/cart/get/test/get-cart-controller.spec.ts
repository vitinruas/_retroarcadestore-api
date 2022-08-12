import { ICartEntitie } from '../../../../../domain/entities/cart/cart-entitie'
import { IGetCartUseCase } from '../../../../../domain/usecases/cart/get-cart-usecase'
import {
  noContent,
  ok,
  serverError
} from '../../../../helpers/http-response-helper'
import { GetCartController } from '../get-cart-controller'
import { IHttpRequest, IHttpResponse } from '../get-cart-controller-protocols'

const makeFakeValidRequest = (): IHttpRequest => ({
  headers: 'any_headers',
  ip: 'any_ip',
  route: 'any_route',
  body: {
    uid: 'any_uid'
  }
})

const makeFakeCart = (): ICartEntitie => ({
  cid: 'any_cid',
  uid: 'any_uid',
  products: [
    {
      pid: 'any_pid',
      quantity: 0,
      price: 10.0
    }
  ]
})

const makeGetCartUseCaseStub = (): IGetCartUseCase => {
  class GetCartUseCaseStub implements IGetCartUseCase {
    async get(uid: string): Promise<ICartEntitie | null> {
      return Promise.resolve(makeFakeCart())
    }
  }
  return new GetCartUseCaseStub()
}

interface ISut {
  sut: GetCartController
  getCartUseCaseStub: IGetCartUseCase
}

const makeSut = (): ISut => {
  const getCartUseCaseStub: IGetCartUseCase = makeGetCartUseCaseStub()
  const sut: GetCartController = new GetCartController(getCartUseCaseStub)
  return {
    sut,
    getCartUseCaseStub
  }
}

describe('AddCartProductController', () => {
  test('should call GetCartUseCase with a PID', async () => {
    const { sut, getCartUseCaseStub } = makeSut()

    const addSpy = jest.spyOn(getCartUseCaseStub, 'get')
    await sut.perform(makeFakeValidRequest())

    expect(addSpy).toHaveBeenCalledWith('any_uid')
  })
  test('should return 500 if GetCartUseCase throws', async () => {
    const { sut, getCartUseCaseStub } = makeSut()
    jest.spyOn(getCartUseCaseStub, 'get').mockImplementationOnce(async () => {
      return Promise.reject(new Error())
    })
    const response: IHttpResponse = await sut.perform(makeFakeValidRequest())

    expect(response).toEqual(serverError(new Error()))
  })

  test('should return 204 if GetCartUseCase fails', async () => {
    const { sut, getCartUseCaseStub } = makeSut()
    jest.spyOn(getCartUseCaseStub, 'get').mockReturnValue(Promise.resolve(null))
    const response: IHttpResponse = await sut.perform(makeFakeValidRequest())

    expect(response).toEqual(noContent())
  })

  test('should return 200 if AddCartProductUseCase succeeds', async () => {
    const { sut } = makeSut()

    const response: IHttpResponse = await sut.perform(makeFakeValidRequest())

    expect(response).toEqual(ok(makeFakeCart()))
  })
})
