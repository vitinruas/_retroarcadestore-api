import { IAddAccountModel } from '../add-account-repository.protocols'
import { AddAccountMongoRepository } from '../add-account-mongo-repository'
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

const makeSut = (): AddAccountMongoRepository => {
  return new AddAccountMongoRepository()
}

const makeFakeValidAccount = (): IAddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

describe('AddAccountMongoRepository', () => {
  test('should add an account and return it', async () => {
    const sut = makeSut()
    const createdAccount = await sut.add(makeFakeValidAccount())
    expect(createdAccount.id).toBeTruthy()
    expect(createdAccount.name).toBe('any_name')
    expect(createdAccount.email).toBe('any_email@mail.com')
    expect(createdAccount.password).toBe('hashed_password')
  })
})
