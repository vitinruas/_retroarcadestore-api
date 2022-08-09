import documentHelper from '../../helpers/document-helper'
import mongoHelper from '../../helpers/mongo-helper'
import { ILogRepository, ILogModel } from './log-repository-protocols'

export class LogRepository implements ILogRepository {
  async log(logData: ILogModel, logName: string): Promise<void> {
    const collectionRef = mongoHelper.getCollection(logName)
    collectionRef.conn.useDb('Logs')
    await collectionRef.insertOne({
      ...logData,
      createdAt: documentHelper.getCurrentTime()
    })
  }
}
