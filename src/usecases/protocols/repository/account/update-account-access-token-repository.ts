export interface IUpdateAccountAccessTokenRepository {
  update(uid: string, accessToken: string): Promise<void>
}
