export interface IAddAccountModel {
  name: string
  email: string
  password: string
}

export interface IAddAccountUseCase {
  add(newAccountData: IAddAccountModel): Promise<string>
}
