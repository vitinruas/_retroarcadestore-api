export interface IUpdateClientUseCaseModel {
  uid: string
  name?: string
  photo?: string
  email?: string
  password?: string
  newPassword?: string
  street?: string
  postalCode?: number
  district?: string
  city?: string
  country?: string
}
export interface IUpdateClientUseCase {
  update(fields: IUpdateClientUseCaseModel): Promise<boolean>
}
