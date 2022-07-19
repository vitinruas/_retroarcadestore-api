import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose, { Collection } from 'mongoose'
import mongoHelper from '../../../helpers/mongo-helper'
import { UpdateAccountAccessToken } from '../update-account-access-token'

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

interface FakeValidAccount {
  name: string
  email: string
  password: string
  accessToken: string
}

const createAccount = async (
  fakeValidAccount: FakeValidAccount
): Promise<any> => {
  const createdAccountID = (await collectionRef.insertOne(fakeValidAccount))
    .insertedId
  return createdAccountID
}

const getAccount = async (id: string) => {
  const createdAccount = await collectionRef.findOne({
    _id: new mongoose.Types.ObjectId(id)
  })
  return createdAccount
}

describe('UpdateAccountAccessToken', () => {
  test('should update a token to a new generated token', async () => {
    const sut = new UpdateAccountAccessToken()
    const fakeValidAccount = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password',
      accessToken: 'any_token'
    }
    const createdAccountID = await createAccount(fakeValidAccount)
    const createdAccount = await getAccount(createdAccountID._id.toString())

    expect(createdAccount!.accessToken).toBe('any_token')

    await sut.updateToken(createdAccountID._id.toString(), 'new_token')
    const updatedAccount = await getAccount(createdAccountID.toString())

    expect(updatedAccount!.accessToken).toBe('new_token')
  })
})
