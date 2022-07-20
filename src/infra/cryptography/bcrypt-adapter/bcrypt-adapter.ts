import { IHasher } from '../../../usecases/account/add-account-protocols'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements IHasher {
  constructor(private readonly salt: number) {}

  async hash(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, this.salt)
    return hashedPassword
  }
}
