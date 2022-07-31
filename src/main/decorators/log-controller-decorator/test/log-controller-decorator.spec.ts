import {
  badRequest,
  noContent
} from '../../../../presentation/helpers/http-response-helper'
import {
  IController,
  IHttpRequest,
  IHttpResponse
} from '../../../../presentation/protocols'
import { LogControllerDecorator } from '../log-controller-decorators'

const makeFakeValidRequest = (): IHttpRequest => ({
  headers: undefined,
  file: undefined,
  files: undefined,
  body: {
    value: 'any_value'
  }
})

const makeControllerStub = (): IController => {
  class ControllerStub implements IController {
    perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
      return Promise.resolve(noContent())
    }
  }
  return new ControllerStub()
}

interface ISut {
  sut: LogControllerDecorator
  controllerStub: IController
}

const makeSut = (): ISut => {
  const controllerStub: IController = makeControllerStub()
  const sut: LogControllerDecorator = new LogControllerDecorator(controllerStub)
  return {
    sut,
    controllerStub
  }
}

describe('LogControllerDecorator', () => {
  test('should call controller with correct values', async () => {
    const { sut, controllerStub } = makeSut()
    const performSpy = jest.spyOn(controllerStub, 'perform')

    await sut.perform(makeFakeValidRequest())

    expect(performSpy).toHaveBeenCalledWith(makeFakeValidRequest())
  })

  test('should returns the same controller response', async () => {
    const { sut, controllerStub } = makeSut()
    jest
      .spyOn(controllerStub, 'perform')
      .mockReturnValue(Promise.resolve(badRequest(new Error())))

    const response: IHttpResponse = await sut.perform(makeFakeValidRequest())

    expect(response).toEqual(badRequest(new Error()))
  })
})
