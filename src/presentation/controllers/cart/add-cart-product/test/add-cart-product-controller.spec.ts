import { IAddCartProductUseCase } from '../../../../../domain/usecases/cart/add-cart-product-usecase'
import { IHttpRequest } from '../../../../protocols'
import { AddCartProductController } from '../add-cart-product-controller'

const makeFakeValidRequest = (): IHttpRequest => ({
  headers: 'any_headers',
  ip: 'any_ip',
  route: 'any_route',
  body: {
    pid: 'any_pid'
  }
})

interface ISut {
  sut: AddCartProductController
  addCartProductUseCaseStub: IAddCartProductUseCase
}

const makeAddCartProductUseCaseStub = (): IAddCartProductUseCase => {
  class AddCartProductUseCaseStub implements IAddCartProductUseCase {
    async add(pid: string): Promise<void> {
      return Promise.resolve()
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

    expect(addSpy).toHaveBeenCalledWith('any_pid')
  })
})
