import jwt from 'jsonwebtoken'
import { IEncrypter } from '../../../usecases/protocols/cryptography/encrypter-protocol'
import { IDecrypter } from '../../../usecases/protocols/cryptography/decrypter-protocol'

export class JwtAdapter implements IEncrypter, IDecrypter {
  constructor(private readonly secretKey: string) {}

  async encrypt(value: string): Promise<string> {
    const token = jwt.sign({ value }, this.secretKey)
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
