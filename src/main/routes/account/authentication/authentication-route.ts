import { Router } from 'express'
import { expressRouteAdapter } from '../../../adapters/express-route-adapter'
import { makeLoginControllerFactory } from '../../../factory/controllers/account/authentication/login-controller-factory'
import { makeSignUpControllerFactory } from '../../../factory/controllers/account/authentication/signup-controller-factory'

export default (router: Router) => {
  router.post('/signup', expressRouteAdapter(makeSignUpControllerFactory()))
  router.post('/login', expressRouteAdapter(makeLoginControllerFactory()))
}
