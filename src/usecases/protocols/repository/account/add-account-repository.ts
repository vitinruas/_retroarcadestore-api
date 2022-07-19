import { IAccountEntitie } from 'src/domain/entities/account'
import { IAddAccountModel } from 'src/domain/usecases/account/add-account-usecase'

export interface IAddAccountRepository {
  add(newAccountData: IAddAccountModel): Promise<IAccountEntitie>
}
