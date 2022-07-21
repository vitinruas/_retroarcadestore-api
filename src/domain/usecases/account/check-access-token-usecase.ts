export interface ICheckAccessTokenUseCase {
  check(accessToken: string, admin?: boolean): Promise<string>
}
