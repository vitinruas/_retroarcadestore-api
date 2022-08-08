import { IProductEntitie } from '../../../../domain/entities/product/product-entitie'
import { IGetProductsRepository } from '../../../protocols/repository/product/get-products-repository-protocol'
import { GetProductsUseCase } from '../get-products-usecase'

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

const makeGetProductsRepositoryStub = (): IGetProductsRepository => {
  class GetProductsRepository implements IGetProductsRepository {
    async get(
      id?: string
    ): Promise<IProductEntitie | IProductEntitie[] | null> {
      return Promise.resolve([
        makeFakeProduct(),
        makeFakeProduct(),
        makeFakeProduct()
      ])
    }
  }
  return new GetProductsRepository()
}

interface ISut {
  sut: GetProductsUseCase
  getProductsRepositoryStub: IGetProductsRepository
}

const makeSut = (): ISut => {
  const getProductsRepositoryStub = makeGetProductsRepositoryStub()
  const sut = new GetProductsUseCase(getProductsRepositoryStub)
  return {
    sut,
    getProductsRepositoryStub
  }
}

describe('GetProductsUseCase', () => {
  test('should call GetProductsRepository without PID', async () => {
    const { sut, getProductsRepositoryStub } = makeSut()
    const getSpy = jest.spyOn(getProductsRepositoryStub, 'get')

    await sut.get()

    expect(getSpy).toHaveBeenCalledWith()
  })

  test('should return throw if GetProductsRepository throws', async () => {
    const { sut, getProductsRepositoryStub } = makeSut()
    jest
      .spyOn(getProductsRepositoryStub, 'get')
      .mockImplementationOnce(async () => Promise.reject(new Error()))

    const promise: Promise<IProductEntitie | IProductEntitie[] | null> =
      sut.get()

    await expect(promise).rejects.toThrow()
  })
})
