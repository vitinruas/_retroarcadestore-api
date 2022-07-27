import { Router } from 'express'
import { expressRouteAdapter } from '../../../adapters/express-route-adapter'
import { middlewareRouteAdapter } from '../../../adapters/middleware-route-adapter'
import { expressMulterAdapter } from '../../../adapters/express-multer-adapter'
import { makeGetClientControllerFactory } from '../../../factory/controllers/client/get-client-controller-factory'
import { makeAuthMiddlewareFactory } from '../../../factory/middlewares/auth/auth-middleware-factory'
import { makeUpdateClientController } from '../../../factory/controllers/client/update-client-controller.factory'

export default (router: Router) => {
  router.get(
    '/client',
    middlewareRouteAdapter(makeAuthMiddlewareFactory()),
    expressRouteAdapter(makeGetClientControllerFactory())
  )

  router.put(
    '/client',
    middlewareRouteAdapter(makeAuthMiddlewareFactory()),
    expressMulterAdapter(),
    expressRouteAdapter(makeUpdateClientController())
  )
}
