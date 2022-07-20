import { Express, Request, Response } from 'express'
export default (app: Express) => {
  app.post('/test', (request: Request, response: Response) => {
    return response.send(request.body)
  })
}
