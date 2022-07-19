import bcrypt from 'bcrypt'
import { IHasher } from 'src/usecases/account/add-account-protocols'

export class BcryptAdapter implements IHasher {
  constructor(private readonly salt: number) {}

  async hash(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, this.salt)
    return hashedPassword
  }
}
