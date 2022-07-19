import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose, { Collection } from 'mongoose'
import { GetAccountByEmailMongoRepository } from '../get-account-by-email-repository'

let mongod: MongoMemoryServer
let collectionRef: Collection

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()
  await mongoose.connect(uri)
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongod.stop()
})

beforeEach(async () => {
  collectionRef = mongoose.connection.collection('accounts')
  await collectionRef.deleteMany({})
})

describe('GetAccountByEmail', () => {
  test('should return an account if using the provided email', async () => {
    const fakeValidAccount = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    }
    await collectionRef.insertOne(fakeValidAccount)

    const sut = new GetAccountByEmailMongoRepository()
    const account = await sut.get('any_email@mail.com')
    expect(account!.id).toBeTruthy()
    expect(account!.name).toBe('any_name')
    expect(account!.email).toBe('any_email@mail.com')
    expect(account!.password).toBe('hashed_password')
  })
})
