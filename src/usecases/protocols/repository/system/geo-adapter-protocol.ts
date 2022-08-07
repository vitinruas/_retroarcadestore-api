export interface IGeoEntitie {
  country: string
  city: string
  coords: {
    latitude: number
    longitude: number
  }
  area?: number
  zipCode?: string
}

export interface IGeoAdapter {
  lookup(ip: string): Promise<IGeoEntitie>
}
