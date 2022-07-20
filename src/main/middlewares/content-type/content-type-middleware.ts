import { Request, Response, NextFunction } from 'express'
export const contentTypeMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  response.contentType('json')
  return next()
}
