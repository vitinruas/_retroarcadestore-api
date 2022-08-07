import { UnauthenticatedLoginError } from '../../../../presentation/errors'
import { IHttpRequest, IHttpResponse } from '../../../../presentation/protocols'
import {
  IGeoAdapter,
  IGeoEntitie
} from '../../../protocols/repository/system/geo-adapter-protocol'
import { ILogRepository } from '../../../protocols/repository/system/log-repository-protocol'
import { LogControllerUseCase } from '../log-controller-usecase'

const makeFakeValidRequest = (): IHttpRequest => ({
  ip: '111.111.111.111',
  route: '/route',
  headers: 'any_headers',
  userAgent: 'any_userAgent',
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeFake401Response = (): IHttpResponse => ({
  statusCode: 401,
  body: new UnauthenticatedLoginError()
})

const makeFakeGeo = (): IGeoEntitie => ({
  city: 'any_city',
  country: 'any_country',
  coords: { latitude: 10.0, longitude: 10.0 },
  area: 1000,
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
    async lookup(ip: string): Promise<IGeoEntitie> {
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
    geoAdapterStub
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

    sut.log(makeFakeValidRequest(), makeFake401Response())

    expect(lookupSpy).toHaveBeenCalledWith('111.111.111.111')
  })

  test('should return throw if GeoAdapter throws', async () => {
    const { sut, geoAdapterStub } = makeSut()
    jest.spyOn(geoAdapterStub, 'lookup').mockImplementationOnce(async () => {
      return Promise.reject(new Error())
    })

    const promise: Promise<void> = sut.log(
      makeFakeValidRequest(),
      makeFake401Response()
    )

    await expect(promise).rejects.toThrow()
  })

  test('should call LogRepository if response returns 401', async () => {
    const { sut, logRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logRepositoryStub, 'log')

    await sut.log(makeFakeValidRequest(), makeFake401Response())
    const logParams = {
      request: makeFakeValidRequest(),
      response: makeFake401Response(),
      geoInformations: makeFakeGeo()
    }
    delete logParams.request.body.password
    expect(logSpy).toHaveBeenCalledWith(logParams, 'unauthenticated')
  })

  test('should return throw if LogRepository throws', async () => {
    const { sut, logRepositoryStub } = makeSut()
    jest.spyOn(logRepositoryStub, 'log').mockImplementationOnce(async () => {
      return Promise.reject(new Error())
    })

    const promise: Promise<void> = sut.log(
      makeFakeValidRequest(),
      makeFake401Response()
    )

    await expect(promise).rejects.toThrow()
  })
})
