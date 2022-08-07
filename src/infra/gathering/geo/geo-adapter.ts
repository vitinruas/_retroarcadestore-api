import {
  IGeoAdapter,
  IGeoEntitie
} from '../../../usecases/system/log/log-controller-usecase-protocols'
import geoip from 'geoip-lite'

export class GeoIPAdapter implements IGeoAdapter {
  async lookup(ip: string): Promise<IGeoEntitie> {
    await geoip.lookup(ip)
    return {
      city: 'any_city',
      country: 'any_country',
      coords: { latitude: 10.0, longitude: 10.0 },
      area: 1000
    }
  }
}
