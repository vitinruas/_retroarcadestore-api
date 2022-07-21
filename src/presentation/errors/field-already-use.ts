export class FieldAlreadyUse extends Error {
  constructor(field: string) {
    super(`${field} already in use`)
    this.name = 'FieldAlreadyUse'
  }
}
