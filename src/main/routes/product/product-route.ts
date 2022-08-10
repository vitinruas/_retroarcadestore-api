import { Router } from 'express'
import { expressRouteAdapter } from '../../adapters/express-route-adapter'
import { makeGetProductControllerFactory } from '../../factory/controllers/products/get-product-controller-factory'
import { makeGetProductsControllerFactory } from '../../factory/controllers/products/get-products-controller-factory'

export default (router: Router) => {
  router.get(
    '/products',
    expressRouteAdapter(makeGetProductsControllerFactory())
  )

  router.get('/product', expressRouteAdapter(makeGetProductControllerFactory()))
}
