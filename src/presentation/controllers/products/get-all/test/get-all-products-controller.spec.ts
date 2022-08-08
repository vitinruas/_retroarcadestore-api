import { IProductEntitie } from '../../../../../domain/entities/product/product-entitie'
import { IGetProductsUseCase } from '../../../../../domain/usecases/product/get-products-usecase'
import { IHttpRequest } from '../../../../protocols'
import { GetAllProductsController } from '../get-all-products-controller'

const makeFakeProduct = (): IProductEntitie => ({
  pid: 'any_id',
  category: 'games',
  name: 'any_name',
  mainImage: 'any_image',
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
    get(id: string): Promise<IProductEntitie | IProductEntitie[]> {
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
  sut: GetAllProductsController
  getProductsUseCaseStub: IGetProductsUseCase
}

const makeSut = (): ISut => {
  const getProductsUseCaseStub: IGetProductsUseCase =
    makeGetProductsUseCaseStub()
  const sut: GetAllProductsController = new GetAllProductsController(
    getProductsUseCaseStub
  )
  return {
    sut,
    getProductsUseCaseStub
  }
}

describe('GetAllProductsController', () => {
  test('should call GetProductsUseCase without PID', () => {
    const { sut, getProductsUseCaseStub } = makeSut()
    const getSpy = jest.spyOn(getProductsUseCaseStub, 'get')

    sut.perform(makeFakeValidRequest())

    expect(getSpy).toHaveBeenCalledWith()
  })
})
