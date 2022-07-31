import { MissingFieldError } from '../validations-errors'
import { IValidation } from '../validations-protocols'

export class RequiredFieldIfThereisAnother implements IValidation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldNameThatMustBeProvided: string
  ) {}

  validate(fields: any): any {
    if (fields[this.fieldName]) {
      if (!fields[this.fieldNameThatMustBeProvided]) {
        return new MissingFieldError(this.fieldNameThatMustBeProvided)
      }
    }
  }
}
