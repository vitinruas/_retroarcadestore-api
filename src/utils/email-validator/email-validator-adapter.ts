import { IEmailValidatorAdapter } from '../../validation/protocols/email-validator-protocol'
import validator from 'validator'

export class EmailValidatorAdapter implements IEmailValidatorAdapter {
  validateEmail(email: string): boolean {
    const isValid: boolean = validator.isEmail(email)
    return isValid
  }
}
