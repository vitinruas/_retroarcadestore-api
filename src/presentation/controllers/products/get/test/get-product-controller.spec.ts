import {
  IGetProductUseCase,
  IHttpRequest,
  IHttpResponse,
  IProductEntitie
} from '../get-product-controller-protocols'
import { noContent, ok } from '../../../../helpers/http-response-helper'
import { GetProductController } from '../get-product-controller'

const makeFakeProduct = (): IProductEntitie => ({
  pid: 'any_id',
  category: 'games',
  name: 'any_name',
  bannerImage: 'any_image',
  cardImage: 'any_image',
  previewImages: ['any_image', 'any_image', 'any_image'],
  description: 'any_description',
  quantity: 'isGame',
  price: 0,
  discount: 0,
  createdAt: 'any_date'
})

const makeFakeValidRequest = (): IHttpRequest => ({
  headers: 'any_headers',
  ip: 'any_ip',
  route: 'any_route',
  body: { pid: 'any_pid' }
})

const makeGetProductUseCaseStub = (): IGetProductUseCase => {
  class GetProductUseCase implements IGetProductUseCase {
    async get(pid: string): Promise<IProductEntitie | null> {
      return Promise.resolve(makeFakeProduct())
    }
  }

  return new GetProductUseCase()
}

interface ISut {
  sut: GetProductController
  getProductUseCaseStub: IGetProductUseCase
}

const makeSut = (): ISut => {
  const getProductUseCaseStub: IGetProductUseCase = makeGetProductUseCaseStub()
  const sut: GetProductController = new GetProductController(
    getProductUseCaseStub
  )
  return {
    sut,
    getProductUseCaseStub
  }
}

describe('GetProductController', () => {
  test('should call GetProductUseCase with PID', () => {
    const { sut, getProductUseCaseStub } = makeSut()
    const getSpy = jest.spyOn(getProductUseCaseStub, 'get')

    sut.perform(makeFakeValidRequest())

    expect(getSpy).toHaveBeenCalledWith('any_pid')
  })

  test('should return 500 if GetProductUseCase throws', async () => {
    const { sut, getProductUseCaseStub } = makeSut()
    jest
      .spyOn(getProductUseCaseStub, 'get')
      .mockImplementationOnce(async () => {
        return Promise.reject(new Error())
      })

    const promise: Promise<IHttpResponse> = sut.perform(makeFakeValidRequest())

    await expect(promise).rejects.toThrow()
  })

  test('should return 204 if there is no product', async () => {
    const { sut, getProductUseCaseStub } = makeSut()
    jest
      .spyOn(getProductUseCaseStub, 'get')
      .mockReturnValue(Promise.resolve(null))

    const response: IHttpResponse = await sut.perform(makeFakeValidRequest())

    expect(response).toEqual(noContent())
  })

  test('should return 200 with the product', async () => {
    const { sut } = makeSut()

    const response: IHttpResponse = await sut.perform(makeFakeValidRequest())

    expect(response).toEqual(
      ok({
        product: makeFakeProduct()
      })
    )
  })
})
