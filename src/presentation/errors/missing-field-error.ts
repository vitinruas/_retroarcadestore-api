export class MissingFieldError extends Error {
  constructor(field: string) {
    super(`Missing field value: ${field}`)
    this.name = 'MissingFieldError'
  }
}
