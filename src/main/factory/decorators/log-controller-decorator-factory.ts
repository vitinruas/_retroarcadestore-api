import { IController } from '../../../presentation/protocols/controller-protocol'
import { GeoIPAdapter } from '../../../infra/gathering/geo/geo-adapter'
import { LogRepository } from '../../../infra/repository/database/mongodb/system/log/log-repository'
import { LogControllerDecorator } from '../../../presentation/decorators/log-controller-decorator/log-controller-decorators'
import { LogControllerUseCase } from '../../../usecases/system/log/log-controller-usecase'

export const makeLogControllerDecoratorFactory = (
  controller: IController
): IController => {
  const geoAdapter = new GeoIPAdapter()
  const logRepository = new LogRepository()
  const logControllerUseCase = new LogControllerUseCase(
    logRepository,
    geoAdapter,
    [
      'password',
      'passwordConfirmation',
      'newPassword',
      'newPasswordConfirmation',
      'accessToken'
    ]
  )
  const logControllerDecorator = new LogControllerDecorator(
    logControllerUseCase,
    controller
  )
  return logControllerDecorator
}
