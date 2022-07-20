import { IHasher } from '../../../usecases/protocols/cryptography/hasher-protocol'

import bcrypt from 'bcrypt'

export class BcryptAdapter implements IHasher {
  constructor(private readonly salt: number) {}

  async hash(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, this.salt)
    return hashedPassword
  }
}
