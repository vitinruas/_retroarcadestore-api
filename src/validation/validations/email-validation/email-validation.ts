import { InvalidFieldError } from '../validations-errors'
import { IValidatorAdapter, IValidation } from '../validations-protocols'

export class EmailValidation implements IValidation {
  constructor(
    private readonly fieldName: string,
    private readonly ValidatorAdapter: IValidatorAdapter
  ) {}

  validate(fields: any): any {
    if (fields[this.fieldName]) {
      const isValid: boolean = this.ValidatorAdapter.validateEmail(
        fields[this.fieldName]
      )
      if (!isValid) {
        return new InvalidFieldError(this.fieldName)
      }
    }
  }
}
