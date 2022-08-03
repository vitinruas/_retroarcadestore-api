export interface IUpdateClientUseCaseModel {
  uid: string
  name?: string
  photo?: string
  birthDay: string
  email?: string
  password?: string
  newPassword?: string
  street?: string
  zipCode?: string
  district?: string
  city?: string
  country?: string
}
export interface IUpdateClientUseCase {
  update(fields: IUpdateClientUseCaseModel): Promise<boolean>
}
