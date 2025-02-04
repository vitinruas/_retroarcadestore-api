import {
  ILogRepository,
  IGeoAdapter,
  IHttpRequest,
  IHttpResponse,
  IGeoEntitie
} from '../log-controller-usecase-protocols'
import { LogControllerUseCase } from '../log-controller-usecase'
import {
  ServerError,
  UnauthenticatedError
} from '../../../../presentation/errors'

const makeFakeValidRequest = (): IHttpRequest => ({
  ip: '111.111.111.111',
  route: '/route',
  headers: 'any_headers',
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeFakeResponse = (code: number, error: any): IHttpResponse => ({
  statusCode: code,
  body: error
})

const makeFakeGeo = (): IGeoEntitie => ({
  city: 'any_city',
  state: 'any_state',
  country: 'any_country',
  coords: { latitude: 10.0, longitude: 10.0 },
  areaRadius: 1000,
  zipCode: '00000-000'
})

const makeLogRepositoryStub = () => {
  class LogRepositoryStub implements ILogRepository {
    async log(data: any): Promise<void> {
      return Promise.resolve()
    }
  }
  return new LogRepositoryStub()
}

const makeGeoAdapterStub = () => {
  class GeoAdapterStub implements IGeoAdapter {
    async lookup(ip: string): Promise<IGeoEntitie | null> {
      return Promise.resolve(makeFakeGeo())
    }
  }
  return new GeoAdapterStub()
}

interface ISut {
  sut: LogControllerUseCase
  logRepositoryStub: ILogRepository
  geoAdapterStub: IGeoAdapter
}

const makeSut = (): ISut => {
  const logRepositoryStub: ILogRepository = makeLogRepositoryStub()
  const geoAdapterStub: IGeoAdapter = makeGeoAdapterStub()
  const sut: LogControllerUseCase = new LogControllerUseCase(
    logRepositoryStub,
    geoAdapterStub,
    [
      'password',
      'passwordConfirmation',
      'newPassword',
      'newPasswordConfirmation',
      'accessToken'
    ]
  )
  return {
    sut,
    logRepositoryStub,
    geoAdapterStub
  }
}

describe('LogControllerUseCase', () => {
  test('should call GeoAdapter with an ip', async () => {
    const { sut, geoAdapterStub } = makeSut()
    const lookupSpy = jest.spyOn(geoAdapterStub, 'lookup')

    sut.log(makeFakeValidRequest(), makeFakeResponse(400, new Error()))

    expect(lookupSpy).toHaveBeenCalledWith('111.111.111.111')
  })

  test('should return throw if GeoAdapter throws', async () => {
    const { sut, geoAdapterStub } = makeSut()
    jest.spyOn(geoAdapterStub, 'lookup').mockImplementationOnce(async () => {
      return Promise.reject(new Error())
    })

    const promise: Promise<void> = sut.log(
      makeFakeValidRequest(),
      makeFakeResponse(400, new Error())
    )

    await expect(promise).rejects.toThrow()
  })

  test('should call LogRepository if response returns 500', async () => {
    const { sut, logRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logRepositoryStub, 'log')

    await sut.log(
      makeFakeValidRequest(),
      makeFakeResponse(500, new ServerError())
    )
    const logParams = {
      request: makeFakeValidRequest(),
      response: makeFakeResponse(500, new ServerError()),
      geoInformations: makeFakeGeo()
    }
    delete logParams.request.body.password
    expect(logSpy).toHaveBeenCalledWith(logParams, 'serverLogErrors')
  })

  test('should call LogRepository if response returns 401', async () => {
    const { sut, logRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logRepositoryStub, 'log')

    await sut.log(
      makeFakeValidRequest(),
      makeFakeResponse(401, new UnauthenticatedError())
    )
    const logParams = {
      request: makeFakeValidRequest(),
      response: makeFakeResponse(401, new UnauthenticatedError()),
      geoInformations: makeFakeGeo()
    }
    delete logParams.request.body.password
    expect(logSpy).toHaveBeenCalledWith(logParams, 'unauthenticatedLogErrors')
  })

  test('should call LogRepository if response returns 403', async () => {
    const { sut, logRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logRepositoryStub, 'log')

    await sut.log(
      makeFakeValidRequest(),
      makeFakeResponse(403, new UnauthenticatedError())
    )
    const logParams = {
      request: makeFakeValidRequest(),
      response: makeFakeResponse(403, new UnauthenticatedError()),
      geoInformations: makeFakeGeo()
    }
    delete logParams.request.body.password
    expect(logSpy).toHaveBeenCalledWith(logParams, 'forbiddenLogErrors')
  })

  test('should call LogRepository if response returns 200 on /login or /signup', async () => {
    const { sut, logRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logRepositoryStub, 'log')

    await sut.log(
      Object.assign(makeFakeValidRequest(), { route: '/login' }),
      makeFakeResponse(200, { accessToken: 'any_token' })
    )
    const logParams = {
      request: Object.assign({}, makeFakeValidRequest(), { route: '/login' }),
      response: makeFakeResponse(200, { accessToken: 'any_token' }),
      geoInformations: makeFakeGeo()
    }
    delete logParams.request.body.password
    delete logParams.response.body.accessToken

    expect(logSpy).toHaveBeenCalledWith(logParams, 'accessLogs')
  })

  test('should return throw if LogRepository throws', async () => {
    const { sut, logRepositoryStub } = makeSut()
    jest.spyOn(logRepositoryStub, 'log').mockImplementationOnce(async () => {
      return Promise.reject(new Error())
    })

    const promise: Promise<void> = sut.log(
      makeFakeValidRequest(),
      makeFakeResponse(401, new Error())
    )

    await expect(promise).rejects.toThrow()
  })
})
