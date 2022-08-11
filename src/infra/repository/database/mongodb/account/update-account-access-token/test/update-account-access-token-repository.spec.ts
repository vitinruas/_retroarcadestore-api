import { UpdateAccountAccessTokenMongoRepository } from '../update-account-access-token-repository'
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

interface IFakeAccount {
  name: string
  email: string
  password: string
  accessToken: string
}

const makeFakeAccount = (): IFakeAccount => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  accessToken: 'any_token'
})

const addAccountToDB = async (fakeAccount: IFakeAccount): Promise<string> => {
  const createdAccountID = (
    await collectionRef.insertOne(fakeAccount)
  ).insertedId.toString()
  return createdAccountID
}

const getAccount = async (id: string) => {
  const createdAccount = await collectionRef.findOne({
    _id: mongoHelper.createMongoID(id)
  })
  return createdAccount
}

const makeSut = (): UpdateAccountAccessTokenMongoRepository => {
  return new UpdateAccountAccessTokenMongoRepository()
}

describe('UpdateAccountAccessTokenMongoRepository', () => {
  test('should update a token to a new generated token', async () => {
    const sut = makeSut()
    const createdAccountID = await addAccountToDB(makeFakeAccount())
    const createdAccount = await getAccount(createdAccountID)

    expect(createdAccount!.accessToken).toBe('any_token')

    await sut.update(createdAccountID, 'new_token')
    const updatedAccount = await getAccount(createdAccountID.toString())

    expect(updatedAccount!.accessToken).toBe('new_token')
  })
})
