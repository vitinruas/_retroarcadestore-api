import { IEmailValidator } from '../../presentation/protocols/email-validator-protocol'
import validator from 'validator'

export class EmailValidator implements IEmailValidator {
  validate(email: string): boolean {
    const isValid: boolean = validator.isEmail(email)
    return isValid
  }
}
