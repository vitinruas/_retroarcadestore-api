export class ServerError extends Error {
  constructor(stack?: string) {
    super(`Unexpected Server Error`)
    this.stack = stack
    this.name = 'ServerError'
  }
}
