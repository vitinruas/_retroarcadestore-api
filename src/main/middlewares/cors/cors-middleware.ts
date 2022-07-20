import { Request, Response, NextFunction } from 'express'
export const corsMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  response.set('access-control-allow-methods', ['GET', 'POST', 'PUT', 'DELETE'])
  response.set('access-control-allow-origin', '*')
  response.set('access-control-allow-headers', '*')
  response.set('access-control-max-age', '86400') // pre-flight time
  return next()
}
