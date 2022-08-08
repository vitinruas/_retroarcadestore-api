import { ILogModel } from '../log-repository-protocols'
import { UnauthenticatedError } from '../../../../../../../presentation/errors'
import mongoose, { Collection } from 'mongoose'
import mongoHelper from '../../../helpers/mongo-helper'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { LogRepository } from '../log-repository'

let mongod: MongoMemoryServer
let collectionRef: Collection

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()
  await mongoHelper.connect(uri)
})

afterAll(async () => {
  await mongoHelper.disconnect()
  await mongod.stop()
})

beforeEach(async () => {
  collectionRef = mongoHelper.getCollection('addresses')
  await collectionRef.deleteMany({})
})
const makeFakeLog = (): ILogModel => ({
  request: {
    ip: '111.111.111.111',
    route: '/route',
    headers: 'any_headers',
    body: {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
  },
  response: {
    statusCode: 401,
    body: new UnauthenticatedError()
  },
  geoInformations: {
    city: 'any_city',
    state: 'any_state',
    country: 'any_country',
    coords: { latitude: 10.0, longitude: 10.0 },
    areaRadius: 1000,
    zipCode: '00000-000'
  }
})

describe('LogRepository', () => {
  test('should add log in the collection matching its name', async () => {
    const sut = new LogRepository()
    mongoose.connection.useDb('logs')

    await sut.log(makeFakeLog(), 'unauthenticated')

    const collectionRef = mongoHelper.getCollection('unauthenticated')
    const quantityDocs = await collectionRef.countDocuments()

    expect(quantityDocs).toBe(1)
  })
})
