import mongoose, { Collection, ConnectOptions } from 'mongoose'

class MongoHelper {
  async connect(uri: string, options?: ConnectOptions) {
    await mongoose.connect(uri, options)
  }

  async disconnect() {
    await mongoose.disconnect()
  }

  getCollection(collectionName: string): Collection {
    return mongoose.connection.collection('accounts')
  }

  replaceMongoID(document: any): any {
    const { _id, ...data }: any = document
    const formattedDocument = Object.assign({}, data, { uid: _id })
    return formattedDocument
  }
}

const mongoHelper = new MongoHelper()
export default mongoHelper
