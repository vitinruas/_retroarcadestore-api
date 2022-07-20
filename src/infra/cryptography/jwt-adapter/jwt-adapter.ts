import { IEncrypter } from '../../../usecases/account/add-account-protocols'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements IEncrypter {
  constructor(private readonly secret: string) {}

  async encrypt(id: string): Promise<string> {
    const token = jwt.sign({ id }, this.secret)
    return token
  }
}
