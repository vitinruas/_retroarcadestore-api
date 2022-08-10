import { IProductEntitie } from '../../../../domain/entities/product/product-entitie'
import { IGetProductRepository } from '../../../product/get-product/get-product-usecase-protocols'
import { AddCartProductUseCase } from '../add-cart-product-usecase'

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
  sut: AddCartProductUseCase
  getProductRepositoryStub: IGetProductRepository
}

const makeSut = (): ISut => {
  const getProductRepositoryStub = makeGetProductRepositoryStub()
  const sut = new AddCartProductUseCase(getProductRepositoryStub)
  return {
    sut,
    getProductRepositoryStub
  }
}

describe('AddCartProductUseCase', () => {
  test('should call GetProductRepository with a PID', async () => {
    const { sut, getProductRepositoryStub } = makeSut()
    const getSpy = jest.spyOn(getProductRepositoryStub, 'get')

    await sut.add('any_uid', 'any_pid')

    expect(getSpy).toHaveBeenCalledWith('any_pid')
  })

  test('should return throw if GetProductRepository throws', async () => {
    const { sut, getProductRepositoryStub } = makeSut()
    jest
      .spyOn(getProductRepositoryStub, 'get')
      .mockImplementationOnce(async () => {
        return Promise.reject(new Error())
      })

    const promise: Promise<boolean> = sut.add('any_uid', 'any_pid')

    await expect(promise).rejects.toThrow()
  })
})
