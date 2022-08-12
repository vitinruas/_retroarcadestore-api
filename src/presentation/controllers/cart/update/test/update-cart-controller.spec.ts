import { IUpdateCartUseCase } from '../../../../../domain/usecases/cart/update-cart-usecase'
import {
  noContent,
  serverError
} from '../../../../helpers/http-response-helper'
import { UpdateCartController } from '../update-cart-controller'
import {
  IHttpRequest,
  IHttpResponse
} from '../update-cart-controller-protocols'

const makeFakeValidRequest = (): IHttpRequest => ({
  headers: 'any_headers',
  ip: 'any_ip',
  route: 'any_route',
  body: {
    increment: true,
    decrement: false,
    promoCode: ''
  }
})

const makeUpdateCartUseCaseStub = (): IUpdateCartUseCase => {
  class UpdateCartUseCaseStub implements IUpdateCartUseCase {
    async update(
      increment: boolean,
      decrement: boolean,
      promoCode: string
    ): Promise<void> {
      return Promise.resolve()
    }
  }
  return new UpdateCartUseCaseStub()
}

interface ISut {
  sut: UpdateCartController
  updateCartUseCaseStub: IUpdateCartUseCase
}

const makeSut = (): ISut => {
  const updateCartUseCaseStub: IUpdateCartUseCase = makeUpdateCartUseCaseStub()
  const sut: UpdateCartController = new UpdateCartController(
    updateCartUseCaseStub
  )
  return {
    sut,
    updateCartUseCaseStub
  }
}

describe('UpdateCartController', () => {
  test('should call UpdateCartUseCase with correct values', async () => {
    const { sut, updateCartUseCaseStub } = makeSut()

    const addSpy = jest.spyOn(updateCartUseCaseStub, 'update')
    await sut.perform(makeFakeValidRequest())

    expect(addSpy).toHaveBeenCalledWith(true, false, '')
  })
  test('should return 500 if UpdateCartUseCase throws', async () => {
    const { sut, updateCartUseCaseStub } = makeSut()
    jest
      .spyOn(updateCartUseCaseStub, 'update')
      .mockImplementationOnce(async () => {
        return Promise.reject(new Error())
      })
    const response: IHttpResponse = await sut.perform(makeFakeValidRequest())

    expect(response).toEqual(serverError(new Error()))
  })

  test('should return 204 if UpdateCartUseCase succeeds', async () => {
    const { sut } = makeSut()

    const response: IHttpResponse = await sut.perform(makeFakeValidRequest())

    expect(response).toEqual(noContent())
  })
})
