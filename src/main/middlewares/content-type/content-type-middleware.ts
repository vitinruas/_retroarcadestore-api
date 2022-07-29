import { Request, Response, NextFunction } from 'express'
export const contentTypeMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  response.contentType('json')
  response.contentType('png')
  response.contentType('jpg')
  return next()
}
