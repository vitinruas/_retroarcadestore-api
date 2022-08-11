import { UpdateClientRepository } from '../update-client-repository'
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
  birthDay: string
  email: string
  password: string
  accessToken: string
}

const makeFakeAccount = (): IFakeAccount => ({
  name: 'any_name',
  birthDay: 'any_date',
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

const makeSut = (): UpdateClientRepository => {
  return new UpdateClientRepository()
}

describe('UpdateClientRepository', () => {
  test('should update a client account', async () => {
    const createdAccountID = await addAccountToDB(makeFakeAccount())

    const sut = makeSut()

    await sut.update({
      uid: createdAccountID,
      photo: 'new_photo',
      birthDay: 'new_date',
      name: 'new_name',
      email: 'new_email@mail.com',
      password: 'new_hashed_password'
    })

    const account = await collectionRef.findOne({
      _id: mongoHelper.createMongoID(createdAccountID)
    })

    expect(account!._id).toBeTruthy()
    expect(account!.photo).toBe('new_photo')
    expect(account!.name).toBe('new_name')
    expect(account!.birthDay).toBe('new_date')
    expect(account!.email).toBe('new_email@mail.com')
    expect(account!.password).toBe('new_hashed_password')
  })
})
