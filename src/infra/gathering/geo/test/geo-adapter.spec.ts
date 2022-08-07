import geoip from 'geoip-lite'
import { GeoIPAdapter } from '../geo-adapter'
import { IGeoEntitie } from '../geo-adapter-protocols'

jest.mock('geoip-lite', () => ({
  lookup() {
    return {
      range: [1000, 1000],
      country: 'any_country',
      region: 'any_state',
      eu: 'any_europeanunion',
      timezone: 'any_timezone',
      city: 'any_city',
      ll: [10.0, 10.0],
      metro: 111,
      area: 1000
    }
  }
}))

const makeFakeGeoAdapterResponse = (): IGeoEntitie => ({
  city: 'any_city',
  state: 'any_state',
  country: 'any_country',
  coords: { latitude: 10.0, longitude: 10.0 },
  areaRadius: 1000,
  zipCode: null
})

const makeSut = () => new GeoIPAdapter()

describe('GeoIPAdapter', () => {
  test('should call GeoIPLite with an ip', async () => {
    const sut = makeSut()
    const lookupSpy = jest.spyOn(geoip, 'lookup')

    await sut.lookup('111.111.111.111')

    expect(lookupSpy).toHaveBeenCalledWith('111.111.111.111')
  })

  test('should return the Geographic informations', async () => {
    const sut = makeSut()

    const geo: IGeoEntitie | null = await sut.lookup('111.111.111.111')

    expect(geo).toEqual(makeFakeGeoAdapterResponse())
  })
})
