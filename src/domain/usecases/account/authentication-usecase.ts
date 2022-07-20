export interface IAuthenticationModel {
  email: string
  password: string
}
export interface IAuthenticationUseCase {
  authenticate(authenticateData: IAuthenticationModel): Promise<string>
}
