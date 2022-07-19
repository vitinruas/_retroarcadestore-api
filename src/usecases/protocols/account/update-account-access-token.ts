export interface IUpdateAccountAccessToken {
  updateToken(id: string, accessToken: string): Promise<void>
}
