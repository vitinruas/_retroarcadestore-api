import { MissingFieldError } from '../validations-errors'
import { IValidation } from '../validations-protocols'

export class RequiredFieldValidation implements IValidation {
  constructor(private readonly fieldName: string) {}

  validate(fields: any): any {
    if (!fields[this.fieldName]) {
      return new MissingFieldError(this.fieldName)
    }
  }
}
