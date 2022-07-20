import { Router } from 'express'
import { expressRouteAdapter } from '../../adapters/express-route-adapter'
import { makeSignUpControllerFactory } from '../../factory/controllers/authentication/signup-controller-factory'

export default (router: Router) => {
  router.post('/signup', expressRouteAdapter(makeSignUpControllerFactory()))
}
