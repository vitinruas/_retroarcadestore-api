export interface IDecrypter {
  decrypt(accessToken: string): Promise<boolean>
}
