import { IAccountEntitie } from './account-entitie'

export interface IAddress {
  aid: string
  uid: string
  street?: string
  postalCode?: number
  district?: string
  city?: string
  country?: string
  updatedAt?: string
}

export interface IClientEntitie extends IAccountEntitie {
  photo?: string
  address?: IAddress
}
