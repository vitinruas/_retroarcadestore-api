export interface IAuthenticationModel {
  email: string
  password: string
}
export interface IAuthenticationUseCase {
  authenticate(authenticationData: IAuthenticationModel): Promise<string | null>
}
