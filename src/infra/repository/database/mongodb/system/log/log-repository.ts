import mongoose from 'mongoose'
import documentHelper from '../../helpers/document-helper'
import mongoHelper from '../../helpers/mongo-helper'
import { ILogRepository, ILogModel } from './log-repository-protocols'

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
