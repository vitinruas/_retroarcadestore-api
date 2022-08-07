import geoip from 'geoip-lite'
import { IGeoAdapter, IGeoEntitie } from './geo-adapter-protocols'

export class GeoIPAdapter implements IGeoAdapter {
  async lookup(ip: string): Promise<IGeoEntitie | null> {
    const geo: geoip.Lookup | null = await geoip.lookup(ip)
    if (geo) {
      const geoFormatted: IGeoEntitie = {
        city: geo.city,
        state: geo.region,
        country: geo.country,
        coords: { latitude: geo.ll[0], longitude: geo.ll[1] },
        areaRadius: geo.area,
        zipCode: null
      }
      return geoFormatted
    }
    return null
  }
}
