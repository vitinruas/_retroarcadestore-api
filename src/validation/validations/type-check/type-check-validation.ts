import { InvalidFieldError } from '../validations-errors'
import { IValidation } from '../validations-protocols'

type Types = 'string' | 'number' | 'boolean'

export class TypeCheckValidation implements IValidation {
  constructor(
    private readonly fieldName: string,
    private readonly type: Types
  ) {}

  validate(fields: any): any {
    if (fields[this.fieldName]) {
      switch (this.type) {
        case 'number':
          if (!Number(fields[this.fieldName]))
            return new InvalidFieldError(this.fieldName)
          break
        default:
          break
      }
    }
  }
}
