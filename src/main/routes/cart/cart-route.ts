import { Router } from 'express'
import { expressRouteAdapter } from '../../adapters/express-route-adapter'
import { middlewareRouteAdapter } from '../../adapters/middleware-route-adapter'
import { makeAddCartProductControllerFactory } from '../../factory/controllers/cart/add-cart-product-controller-factory'
import { makeGetCartControllerFactory } from '../../factory/controllers/cart/get-cart-controller-factory'
import { makeAuthMiddlewareFactory } from '../../factory/middlewares/auth/auth-middleware-factory'

export default (router: Router) => {
  router.get(
    '/cart',
    middlewareRouteAdapter(makeAuthMiddlewareFactory()),
    expressRouteAdapter(makeGetCartControllerFactory())
  )
  router.post(
    '/cart',
    middlewareRouteAdapter(makeAuthMiddlewareFactory()),
    expressRouteAdapter(makeAddCartProductControllerFactory())
  )
}
