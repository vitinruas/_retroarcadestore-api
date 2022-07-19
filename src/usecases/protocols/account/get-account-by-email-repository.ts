import { IAccountEntitie } from 'src/domain/entities/account'

export interface IGetAccountByEmailRepository {
  get(email: string): Promise<IAccountEntitie | null>
}
