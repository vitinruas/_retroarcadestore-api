import express, { NextFunction, Request, Response } from 'express'
import path from 'path'
import app from '../../config/app'

export const staticMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  app.use(
    express.static(path.resolve(__dirname, '..', '..', '..', '..', 'public/'))
  )

  return next()
}
