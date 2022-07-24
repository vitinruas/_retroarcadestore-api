import { IEncrypter } from '../../../usecases/protocols/cryptography/encrypter-protocol'
import jwt from 'jsonwebtoken'
import { IDecrypter } from '../../../usecases/protocols/cryptography/decrypter-protocol'

export class JwtAdapter implements IEncrypter, IDecrypter {
  constructor(private readonly secretKey: string) {}

  async encrypt(id: string): Promise<string> {
    const token = jwt.sign({ id }, this.secretKey)
    return token
  }

  async decrypt(accessToken: string): Promise<boolean> {
    let isValid: boolean = false
    await jwt.verify(accessToken, this.secretKey, (error, decode) => {
      if (!error) {
        isValid = true
      }
    })
    return isValid
  }
}
