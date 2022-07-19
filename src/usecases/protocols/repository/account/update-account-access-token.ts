export interface IUpdateAccountAccessToken {
  update(id: string, accessToken: string): Promise<void>
}
