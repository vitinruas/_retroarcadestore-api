import { UpdateClientRepository } from '../update-client-repository'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose, { Collection } from 'mongoose'
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

const makeSut = (): UpdateClientRepository => {
  return new UpdateClientRepository()
}

describe('UpdateClientRepository', () => {
  test('should update a client account', async () => {
    const fakeValidAccount = {
      name: 'any_name',
      email: 'any_email@mail.com',
      createdAt: 'any_date',
      authenticatedAt: 'any_date'
    }
    const createdAccountID = (
      await collectionRef.insertOne(fakeValidAccount)
    ).insertedId.toString()
    const sut = makeSut()

    await sut.update({
      uid: createdAccountID,
      photo: 'new_photo',
      name: 'new_name',
      email: 'new_email@mail.com',
      password: 'new_hashed_password'
    })

    const account = await collectionRef.findOne({
      _id: new mongoose.Types.ObjectId(createdAccountID)
    })

    expect(account!._id).toBeTruthy()
    expect(account!.photo).toBe('new_photo')
    expect(account!.name).toBe('new_name')
    expect(account!.email).toBe('new_email@mail.com')
    expect(account!.password).toBe('new_hashed_password')
  })
})
