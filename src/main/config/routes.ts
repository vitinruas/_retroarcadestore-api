import { Express, Request, Response } from 'express'
export default (app: Express) => {
  app.use('/test', (request: Request, response: Response) => {
    return response.send(request.body)
  })
}
