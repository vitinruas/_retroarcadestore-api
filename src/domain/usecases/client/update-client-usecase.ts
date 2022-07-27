export interface IUpdateClientUseCaseModel {
  name?: string
  photo?: string
  email?: string
  newPassword?: string
  newPasswordConfirmation?: string
  password?: string
  street?: string
  postalCode?: number
  complement?: string
  district?: string
  city?: string
  country?: string
}
export interface IUpdateClientUseCase {
  update(fields: IUpdateClientUseCaseModel): Promise<void>
}
