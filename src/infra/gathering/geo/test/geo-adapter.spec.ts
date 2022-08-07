import { GeoIPAdapter } from '../geo-adapter'
import geoip from 'geoip-lite'
import { IGeoEntitie } from '../../../../usecases/system/log/log-controller-usecase-protocols'

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

describe('GeoIPAdapter', () => {
  test('should call GeoIPLite with an ip', async () => {
    const sut = new GeoIPAdapter()
    const lookupSpy = jest.spyOn(geoip, 'lookup')

    await sut.lookup('111.111.111.111')

    expect(lookupSpy).toHaveBeenCalledWith('111.111.111.111')
  })

  test('should return the Geographic informations', async () => {
    const sut = new GeoIPAdapter()

    const geo: IGeoEntitie | null = await sut.lookup('111.111.111.111')

    expect(geo).toEqual({
      city: 'any_city',
      state: 'any_state',
      country: 'any_country',
      coords: { latitude: 10.0, longitude: 10.0 },
      areaRadius: 1000,
      zipCode: null
    })
  })
})
