import { IAddress } from '../../entities/account/client-entitie'

export interface IGetClientModel {
  uid: string
  photo?: string
  name: string
  birthDay: string
  email: string
  address?: IAddress
  createdAt: string
  authenticatedAt: string
}

export interface IGetClientUseCase {
  get(uid: string): Promise<IGetClientModel>
}
