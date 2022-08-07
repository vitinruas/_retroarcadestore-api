export class UnauthenticatedError extends Error {
  constructor() {
    super(`Invalid Email or Password`)
    this.name = 'UnauthenticatedError'
  }
}
