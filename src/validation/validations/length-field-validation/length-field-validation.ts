import { LengthFieldError } from '../validations-errors'
import { IValidation } from '../validations-protocols'

export class LengthFieldValidation implements IValidation {
  constructor(
    private readonly fieldName: string,
    private readonly minLength: number = 0,
    private readonly maxLength: number = 0
  ) {}

  validate(fields: any): any {
    const min: boolean =
      this.minLength !== 0 && fields[this.fieldName].length < this.minLength
    const max: boolean =
      this.maxLength !== 0 && fields[this.fieldName].length > this.maxLength
    if (min || max) {
      return new LengthFieldError(
        this.fieldName,
        this.minLength,
        this.maxLength
      )
    }
  }
}
