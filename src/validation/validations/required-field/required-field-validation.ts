import { MissingFieldError } from '../validations-errors'
import { IValidation } from '../validations-protocols'

export class RequiredFieldValidation implements IValidation {
  constructor(private readonly fieldName: string) {}

  validate(input: any): any {
    if (!input[this.fieldName]) {
      return new MissingFieldError(this.fieldName)
    }
  }
}
