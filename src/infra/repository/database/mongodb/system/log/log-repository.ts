import mongoose from 'mongoose'
import {
  ILogModel,
  ILogRepository
} from '../../../../../../usecases/system/log/log-controller-usecase-protocols'
import documentHelper from '../../helpers/document-helper'
import mongoHelper from '../../helpers/mongo-helper'

export class LogRepository implements ILogRepository {
  async log(logData: ILogModel, logName: string): Promise<void> {
    mongoose.connection.useDb('logs')
    const collectionRef = mongoHelper.getCollection(logName)
    await collectionRef.insertOne({
      ...logData,
      createdAt: documentHelper.getCurrentTime()
    })
  }
}
