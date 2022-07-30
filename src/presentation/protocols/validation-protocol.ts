export interface IValidation {
  validate(fields: any): Promise<Error | void>
}
