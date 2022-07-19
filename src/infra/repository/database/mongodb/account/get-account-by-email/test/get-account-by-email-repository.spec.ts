import { GetAccountByEmailMongoRepository } from '../get-account-by-email-repository'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Collection } from 'mongoose'
import mongoHelper from '../../../helpers/mongo-helper'

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
  collectionRef = mongoHelper.getCollection('accounts')
  await collectionRef.deleteMany({})
})

const makeSut = (): GetAccountByEmailMongoRepository => {
  return new GetAccountByEmailMongoRepository()
}

describe('GetAccountByEmail', () => {
  test('should return an account if using the provided email', async () => {
    const fakeValidAccount = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    }
    await collectionRef.insertOne(fakeValidAccount)

    const sut = makeSut()
    const account = await sut.get('any_email@mail.com')
    expect(account!.id).toBeTruthy()
    expect(account!.name).toBe('any_name')
    expect(account!.email).toBe('any_email@mail.com')
    expect(account!.password).toBe('hashed_password')
  })

  test('should return null if there is no account exists', async () => {
    const sut = makeSut()

    const account = await sut.get('any_email@mail.com')

    expect(account).toBeNull()
  })
})
