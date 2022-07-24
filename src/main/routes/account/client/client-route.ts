import { Request, Router } from 'express'
import { middlewareRouteAdapter } from '../../../adapters/middleware-route-adapter'
import { makeAuthMiddlewareFactory } from '../../../factory/middlewares/auth/auth-middleware-factory'
export default (router: Router) => {
  router.post(
    '/client/update',
    middlewareRouteAdapter(makeAuthMiddlewareFactory()),
    (request: Request) => {
      console.log(request.body)
    }
  )
}
