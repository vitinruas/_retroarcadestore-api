import { InvalidFieldError } from '../validations-errors'
import { IEmailValidatorAdapter, IValidation } from '../validations-protocols'

export class EmailValidation implements IValidation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidatorAdapter: IEmailValidatorAdapter
  ) {}

  validate(fields: any): any {
    if (fields[this.fieldName]) {
      const isValid: boolean = this.emailValidatorAdapter.validateEmail(
        fields[this.fieldName]
      )
      if (!isValid) {
        return new InvalidFieldError(this.fieldName)
      }
    }
  }
}
