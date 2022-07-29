import { IAccountEntitie } from './account-entitie'

export interface IClientEntitie extends IAccountEntitie {
  photo?: string
  street: string
  postalCode: number
  district: string
  city: string
  country: string
}
