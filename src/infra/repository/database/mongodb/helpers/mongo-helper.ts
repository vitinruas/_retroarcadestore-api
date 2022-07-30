import mongoose, { Collection, ConnectOptions } from 'mongoose'

class MongoHelper {
  async connect(uri: string, options?: ConnectOptions) {
    await mongoose.connect(uri, options)
  }

  async disconnect() {
    await mongoose.disconnect()
  }

  getCollection(collectionName: string): Collection {
    return mongoose.connection.collection(collectionName)
  }

  replaceMongoID(document: any, idName: string): any {
    try {
      const { _id, ...data }: any = document
      const formattedDocument = Object.assign({}, data, { [idName]: _id })
      return formattedDocument
    } catch (error) {
      return {}
    }
  }
}

const mongoHelper = new MongoHelper()
export default mongoHelper
