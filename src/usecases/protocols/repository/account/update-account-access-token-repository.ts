export interface IUpdateAccountAccessTokenRepository {
  update(id: string, accessToken: string): Promise<void>
}
