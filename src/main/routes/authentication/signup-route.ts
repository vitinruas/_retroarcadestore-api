import { Router } from 'express'
import { expressRouteAdapter } from '../../adapters/express-route-adapter'
import { IController } from '../../../presentation/protocols/controller-protocol'
import {
  IHttpRequest,
  IHttpResponse
} from 'src/presentation/protocols/http-protocol'

class Controller implements IController {
  perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return Promise.resolve({
      statusCode: 200,
      body: 'ok'
    })
  }
}

export default (router: Router) => {
  router.post('/signup', expressRouteAdapter(new Controller()))
}
