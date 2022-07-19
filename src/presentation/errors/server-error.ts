export class ServerError extends Error {
  constructor() {
    super(`Unexpected Server Error`)
    this.name = 'ServerError'
  }
}
