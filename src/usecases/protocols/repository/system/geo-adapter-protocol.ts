export interface IGeoEntitie {
  city?: string | null
  state?: string | null
  country?: string | null
  coords?: {
    latitude: number
    longitude: number
  } | null
  areaRadius?: number | null
  zipCode?: string | null
}

export interface IGeoAdapter {
  lookup(ip: string): Promise<IGeoEntitie | null>
}
