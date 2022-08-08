import { IValidatorAdapter } from '../../validation/protocols/email-validator-protocol'
import validator from 'validator'
import { IAlphaValidatorAdapter } from '../../validation/protocols/alpha-validator-protocol'

export class ValidatorAdapter
  implements IValidatorAdapter, IAlphaValidatorAdapter
{
  validateAlpha(value: string): boolean {
    const isValid: boolean = validator.isAlpha(value, 'en-US', { ignore: ' ' })
    return isValid
  }

  validateEmail(email: string): boolean {
    const isValid: boolean = validator.isEmail(email)
    return isValid
  }
}
