import { GetCartUseCase } from '../get-cart-usecase'
import { ICartEntitie, IGetCartRepository } from '../get-cart-usecase-protocols'

const makeFakeCart = (): ICartEntitie => ({
  cid: 'any_cid',
  uid: 'any_uid',
  products: [
    {
      pid: 'any_pid',
      quantity: 0
    }
  ]
})

const makeGetCartRepositoryStub = (): IGetCartRepository => {
  class GetCartRepositoryStub implements IGetCartRepository {
    async get(uid: string): Promise<ICartEntitie | null> {
      return Promise.resolve(makeFakeCart())
    }
  }
  return new GetCartRepositoryStub()
}

interface ISut {
  sut: GetCartUseCase
  getCartRepositoryStub: IGetCartRepository
}

const makeSut = (): ISut => {
  const getCartRepositoryStub: IGetCartRepository = makeGetCartRepositoryStub()
  const sut = new GetCartUseCase(getCartRepositoryStub)
  return {
    sut,
    getCartRepositoryStub
  }
}

describe('GetCartUseCase', () => {
  test('should call GetCartRepository with a UID', async () => {
    const { sut, getCartRepositoryStub } = makeSut()
    const getSpy = jest.spyOn(getCartRepositoryStub, 'get')

    await sut.get('any_uid')

    expect(getSpy).toHaveBeenCalledWith('any_uid')
  })

  test('should return throw if GetCartRepository throws', async () => {
    const { sut, getCartRepositoryStub } = makeSut()
    jest
      .spyOn(getCartRepositoryStub, 'get')
      .mockImplementationOnce(async () => {
        return Promise.reject(new Error())
      })

    const promise: Promise<ICartEntitie | null> = sut.get('any_uid')

    await expect(promise).rejects.toThrow()
  })

  test('should return Cart if GetCartRepository succeeds', async () => {
    const { sut } = makeSut()

    const cart: ICartEntitie | null = await sut.get('any_uid')

    expect(cart).toEqual(makeFakeCart())
  })
})
