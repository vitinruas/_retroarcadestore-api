import {
  IGetProductRepository,
  IProductEntitie
} from '../get-product-usecase-protocols'
import { GetProductUseCase } from '../get-product-usecase'

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

const makeGetProductRepositoryStub = (): IGetProductRepository => {
  class GetProductRepository implements IGetProductRepository {
    async get(pid: string): Promise<IProductEntitie | null> {
      return Promise.resolve(makeFakeProduct())
    }
  }
  return new GetProductRepository()
}

interface ISut {
  sut: GetProductUseCase
  getProductRepositoryStub: IGetProductRepository
}

const makeSut = (): ISut => {
  const getProductRepositoryStub = makeGetProductRepositoryStub()
  const sut = new GetProductUseCase(getProductRepositoryStub)
  return {
    sut,
    getProductRepositoryStub
  }
}

describe('GetProductUseCase', () => {
  test('should call GetProductRepository with PID', async () => {
    const { sut, getProductRepositoryStub } = makeSut()
    const getSpy = jest.spyOn(getProductRepositoryStub, 'get')

    await sut.get('any_pid')

    expect(getSpy).toHaveBeenCalledWith('any_pid')
  })
})

test('should return throw if GetProductRepository throws', async () => {
  const { sut, getProductRepositoryStub } = makeSut()
  jest
    .spyOn(getProductRepositoryStub, 'get')
    .mockImplementationOnce(async () => Promise.reject(new Error()))

  const promise: Promise<IProductEntitie | null> = sut.get('any_id')

  await expect(promise).rejects.toThrow()
})

test('should return product if GetProductRepository succeeds', async () => {
  const { sut, getProductRepositoryStub } = makeSut()
  jest.spyOn(getProductRepositoryStub, 'get')

  const product: IProductEntitie | null = await sut.get('any_id')

  expect(product).toEqual(makeFakeProduct())
})
