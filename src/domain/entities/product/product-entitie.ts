import { IAvaliationEntitie } from './avaliation-entitie'

type CategoryType = 'games' | 'clothes' | 'accessories'

export interface IProductEntitie {
  pid: string
  category: CategoryType
  name: string
  bannerImage: string
  cardImage: string
  previewImages: string[]
  description: string
  avaliations?: IAvaliationEntitie[]
  quantity: number | 'isGame'
  price: number
  discount: number
  createdAt: string
  isEnabled?: boolean
  updatedAt?: string
}
