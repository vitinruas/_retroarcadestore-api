import { IHasher } from '../../../usecases/protocols/cryptography/hasher-protocol'

import bcrypt from 'bcrypt'
import { IHashComparer } from '../../../usecases/protocols/cryptography/hash-comparer-protocol'

export class BcryptAdapter implements IHasher, IHashComparer {
  constructor(private readonly salt: number) {}

  async hash(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, this.salt)
    return hashedPassword
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}
