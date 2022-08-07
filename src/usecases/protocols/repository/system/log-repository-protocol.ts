import { IHttpRequest, IHttpResponse } from '../../../../presentation/protocols'
import { IGeoEntitie } from './geo-adapter-protocol'

export interface ILogModel {
  response: IHttpResponse
  request: IHttpRequest
  geoInformations: IGeoEntitie
}

export interface ILogRepository {
  log(logData: ILogModel, logName: string): Promise<void>
}
