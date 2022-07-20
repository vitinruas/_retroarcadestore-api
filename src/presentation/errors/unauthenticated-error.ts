export class UnauthenticatedLoginError extends Error {
  constructor() {
    super(`Invalid Email or Password`)
    this.name = 'UnauthenticatedLoginError'
  }
}
