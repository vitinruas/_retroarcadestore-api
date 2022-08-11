import { IProductEntitie } from '../../../../domain/entities/product/product-entitie'
import { IGetProductRepository } from '../../../product/get-product/get-product-usecase-protocols'
import { IAddCartProductRepository } from '../../../protocols/repository/cart/add-cart-product-repository'
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

const makeAddCartProductRepositoryStub = (): IAddCartProductRepository => {
  class AddCartProductRepositoryStub implements IAddCartProductRepository {
    async add(uid: string, pid: string): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddCartProductRepositoryStub()
}

interface ISut {
  sut: AddCartProductUseCase
  getProductRepositoryStub: IGetProductRepository
  addCartProductRepositoryStub: IAddCartProductRepository
}

const makeSut = (): ISut => {
  const getProductRepositoryStub: IGetProductRepository =
    makeGetProductRepositoryStub()
  const addCartProductRepositoryStub: IAddCartProductRepository =
    makeAddCartProductRepositoryStub()
  const sut = new AddCartProductUseCase(
    getProductRepositoryStub,
    addCartProductRepositoryStub
  )
  return {
    sut,
    getProductRepositoryStub,
    addCartProductRepositoryStub
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

  test('should call AddProductCartRepository with correct values', async () => {
    const { sut, addCartProductRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addCartProductRepositoryStub, 'add')

    await sut.add('any_uid', 'any_pid')

    expect(addSpy).toHaveBeenCalledWith('any_uid', 'any_pid')
  })

  test('should return false if GetProductRepository fails', async () => {
    const { sut, getProductRepositoryStub } = makeSut()
    jest
      .spyOn(getProductRepositoryStub, 'get')
      .mockReturnValueOnce(Promise.resolve(null))

    const productHasBeenAdded: boolean = await sut.add('any_uid', 'any_pid')

    expect(productHasBeenAdded).toBe(false)
  })

  test('should return throw if AddProductCartRepository throws', async () => {
    const { sut, addCartProductRepositoryStub } = makeSut()
    jest
      .spyOn(addCartProductRepositoryStub, 'add')
      .mockImplementation(async () => {
        return Promise.reject(new Error())
      })

    const promise: Promise<boolean> = sut.add('any_uid', 'any_pid')

    await expect(promise).rejects.toThrow()
  })

  test('should return true if GetProductRepository succeeds', async () => {
    const { sut } = makeSut()

    const productHasBeenAdded: boolean = await sut.add('any_uid', 'any_pid')

    expect(productHasBeenAdded).toBe(true)
  })
})
