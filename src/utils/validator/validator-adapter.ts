import { IEmailValidatorAdapter } from '../../validation/protocols/email-validator-protocol'
import validator from 'validator'
import { IAlphaValidatorAdapter } from '../../validation/protocols/alpha-validator-protocol'

export class EmailValidatorAdapter
  implements IEmailValidatorAdapter, IAlphaValidatorAdapter
{
  validateAlpha(value: string): boolean {
    const isValid: boolean = validator.isAlpha(value)
    return isValid
  }

  validateEmail(email: string): boolean {
    const isValid: boolean = validator.isEmail(email)
    return isValid
  }
}
