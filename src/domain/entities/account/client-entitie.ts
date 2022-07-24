import { IAccountEntitie } from './account-entitie'

export interface IAddress {
  street: string
  postalCode: number
  district: string
  city: string
  country: string
  complement: string
}

export interface IClientEntitie extends IAccountEntitie {
  photo?: string
  address?: IAddress
}
