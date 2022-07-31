/* eslint-disable no-this-before-super */
/* eslint-disable constructor-super */
export class LengthFieldError extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'LengthFieldError'
  }
}
