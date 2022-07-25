import { Router } from 'express'
import { expressRouteAdapter } from '../../../adapters/express-route-adapter'
import { middlewareRouteAdapter } from '../../../adapters/middleware-route-adapter'
import { makeGetClientControllerFactory } from '../../../factory/controllers/client/get-client-controller-factory'
import { makeAuthMiddlewareFactory } from '../../../factory/middlewares/auth/auth-middleware-factory'
import expressMulterAdapter from '../../../adapters/express-multer-adapter'
export default (router: Router) => {
  router.get(
    '/client',
    middlewareRouteAdapter(makeAuthMiddlewareFactory()),
    expressRouteAdapter(makeGetClientControllerFactory())
  )

  router.put('/client', expressMulterAdapter('photo'))
}
