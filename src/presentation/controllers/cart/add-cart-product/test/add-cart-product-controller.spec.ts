import { InvalidFieldError } from '../../../../errors'
import {
  badRequest,
  noContent,
  serverError
} from '../../../../helpers/http-response-helper'
import { AddCartProductController } from '../add-cart-product-controller'
import {
  IAddCartProductUseCase,
  IHttpRequest,
  IHttpResponse
} from '../add-cart-product-controller-protocols'

const makeFakeValidRequest = (): IHttpRequest => ({
  headers: 'any_headers',
  ip: 'any_ip',
  route: 'any_route',
  body: {
    uid: 'any_uid',
    pid: 'any_pid'
  }
})

interface ISut {
  sut: AddCartProductController
  addCartProductUseCaseStub: IAddCartProductUseCase
}

const makeAddCartProductUseCaseStub = (): IAddCartProductUseCase => {
  class AddCartProductUseCaseStub implements IAddCartProductUseCase {
    async add(uid: string, pid: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new AddCartProductUseCaseStub()
}

const makeSut = (): ISut => {
  const addCartProductUseCaseStub = makeAddCartProductUseCaseStub()
  const sut: AddCartProductController = new AddCartProductController(
    addCartProductUseCaseStub
  )
  return {
    sut,
    addCartProductUseCaseStub
  }
}

describe('AddCartProductController', () => {
  test('should call AddCartProductUseCase with a PID', async () => {
    const { sut, addCartProductUseCaseStub } = makeSut()

    const addSpy = jest.spyOn(addCartProductUseCaseStub, 'add')
    await sut.perform(makeFakeValidRequest())

    expect(addSpy).toHaveBeenCalledWith('any_uid', 'any_pid')
  })
  test('should return 500 if AddCartProductUseCase throws', async () => {
    const { sut, addCartProductUseCaseStub } = makeSut()
    jest
      .spyOn(addCartProductUseCaseStub, 'add')
      .mockImplementationOnce(async () => {
        return Promise.reject(new Error())
      })
    const response: IHttpResponse = await sut.perform(makeFakeValidRequest())

    expect(response).toEqual(serverError(new Error()))
  })

  test('should return 400 if AddCartProductUseCase fails', async () => {
    const { sut, addCartProductUseCaseStub } = makeSut()
    jest
      .spyOn(addCartProductUseCaseStub, 'add')
      .mockReturnValue(Promise.resolve(false))
    const response: IHttpResponse = await sut.perform(makeFakeValidRequest())

    expect(response).toEqual(badRequest(new InvalidFieldError('product')))
  })

  test('should return 204 if AddCartProductUseCase succeeds', async () => {
    const { sut } = makeSut()

    const response: IHttpResponse = await sut.perform(makeFakeValidRequest())

    expect(response).toEqual(noContent())
  })
})
