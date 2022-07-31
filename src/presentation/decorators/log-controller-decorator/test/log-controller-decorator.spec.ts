import {
  badRequest,
  noContent
} from '../../../../presentation/helpers/http-response-helper'
import {
  IController,
  IHttpRequest,
  IHttpResponse
} from '../../../../presentation/protocols'
import { ILogControllerUseCase } from '../../../../domain/usecases/system/log/log-controller-usecase'
import { LogControllerDecorator } from '../log-controller-decorators'

const makeFakeValidRequest = (): IHttpRequest => ({
  headers: undefined,
  file: undefined,
  files: undefined,
  body: {
    value: 'any_value'
  }
})

const makeFakeValidResponse = (): IHttpResponse => ({
  statusCode: 200,
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

const makeLogControllerUseCaseStub = (): ILogControllerUseCase => {
  class LogControllerUseCaseStub implements ILogControllerUseCase {
    log(request: IHttpRequest, response: IHttpResponse): Promise<void> {
      return Promise.resolve()
    }
  }
  return new LogControllerUseCaseStub()
}

interface ISut {
  sut: LogControllerDecorator
  logControllerUseCaseStub: ILogControllerUseCase
  controllerStub: IController
}

const makeSut = (): ISut => {
  const logControllerUseCaseStub: ILogControllerUseCase =
    makeLogControllerUseCaseStub()
  const controllerStub: IController = makeControllerStub()
  const sut: LogControllerDecorator = new LogControllerDecorator(
    logControllerUseCaseStub,
    controllerStub
  )
  return {
    sut,
    logControllerUseCaseStub,
    controllerStub
  }
}

describe('LogControllerDecorator', () => {
  test('should call Controller with correct values', async () => {
    const { sut, controllerStub } = makeSut()
    const performSpy = jest.spyOn(controllerStub, 'perform')

    await sut.perform(makeFakeValidRequest())

    expect(performSpy).toHaveBeenCalledWith(makeFakeValidRequest())
  })

  test('should call LogControllerUseCase with correct values', async () => {
    const { sut, controllerStub, logControllerUseCaseStub } = makeSut()
    jest
      .spyOn(controllerStub, 'perform')
      .mockReturnValue(Promise.resolve(makeFakeValidResponse()))
    const logSpy = jest.spyOn(logControllerUseCaseStub, 'log')

    await sut.perform(makeFakeValidRequest())

    expect(logSpy).toHaveBeenCalledWith(
      makeFakeValidRequest(),
      makeFakeValidResponse()
    )
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
