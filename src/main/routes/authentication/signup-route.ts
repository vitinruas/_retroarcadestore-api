import { Router, Request, Response } from 'express'
export default (router: Router) => {
  router.post('/signup', (request: Request, response: Response) => {
    return response.json({ ok: 200 }).send()
  })
}
