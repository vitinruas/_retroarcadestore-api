import { IProductEntitie } from '../../../../../domain/entities/product/product-entitie'
import { IGetProductsUseCase } from '../../../../../domain/usecases/product/get-products-usecase'
import { noContent, ok } from '../../../../helpers/http-response-helper'
import { IHttpRequest, IHttpResponse } from '../../../../protocols'
import { GetProductsController } from '../get-products-controller'

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
  body: {}
})

const makeGetProductsUseCaseStub = (): IGetProductsUseCase => {
  class GetProductsUseCase implements IGetProductsUseCase {
    get(): Promise<IProductEntitie[] | null> {
      return Promise.resolve([
        makeFakeProduct(),
        makeFakeProduct(),
        makeFakeProduct()
      ])
    }
  }

  return new GetProductsUseCase()
}

interface ISut {
  sut: GetProductsController
  getProductsUseCaseStub: IGetProductsUseCase
}

const makeSut = (): ISut => {
  const getProductsUseCaseStub: IGetProductsUseCase =
    makeGetProductsUseCaseStub()
  const sut: GetProductsController = new GetProductsController(
    getProductsUseCaseStub
  )
  return {
    sut,
    getProductsUseCaseStub
  }
}

describe('GetProductsController', () => {
  test('should call GetProductsUseCase without PID', () => {
    const { sut, getProductsUseCaseStub } = makeSut()
    const getSpy = jest.spyOn(getProductsUseCaseStub, 'get')

    sut.perform(makeFakeValidRequest())

    expect(getSpy).toHaveBeenCalledWith()
  })
  test('should return 500 if GetProductsUseCase throws', async () => {
    const { sut, getProductsUseCaseStub } = makeSut()
    jest
      .spyOn(getProductsUseCaseStub, 'get')
      .mockImplementationOnce(async () => {
        return Promise.reject(new Error())
      })

    const promise: Promise<IHttpResponse> = sut.perform(makeFakeValidRequest())

    await expect(promise).rejects.toThrow()
  })
  test('should return 204 if there is no product', async () => {
    const { sut, getProductsUseCaseStub } = makeSut()
    jest
      .spyOn(getProductsUseCaseStub, 'get')
      .mockReturnValue(Promise.resolve(null))

    const response: IHttpResponse = await sut.perform(makeFakeValidRequest())

    expect(response).toEqual(noContent())
  })

  test('should return 200 with products', async () => {
    const { sut } = makeSut()

    const response: IHttpResponse = await sut.perform(makeFakeValidRequest())

    expect(response).toEqual(
      ok({
        products: [makeFakeProduct(), makeFakeProduct(), makeFakeProduct()]
      })
    )
  })
})
