import { GetAccountByUIDRepository } from '../get-account-by-uid-repository'
import { IAccountEntitie } from '../get-account-by-uid-repository-protocols'
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

interface FakeValidAccount {
  name: string
  email: string
  password: string
  accessToken: string
  createdAt: string
  authenticatedAt: string
}

const makeFakeValidAccount = (): FakeValidAccount => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  accessToken: 'any_token',
  createdAt: 'any_date',
  authenticatedAt: 'any_date'
})

const addAccountToDB = async (
  fakeValidAccount: FakeValidAccount
): Promise<any> => {
  const createdAccountID = (await collectionRef.insertOne(fakeValidAccount))
    .insertedId
  return createdAccountID
}

const makeSut = (): GetAccountByUIDRepository => {
  return new GetAccountByUIDRepository()
}

describe('GetAccountByUIDRepository', () => {
  test('should return an account with provided uid', async () => {
    const createdAccountID = await addAccountToDB(makeFakeValidAccount())
    const sut = makeSut()

    const account: IAccountEntitie = await sut.get(createdAccountID)

    expect(account!.uid).toBeTruthy()
    expect(account!.name).toBe('any_name')
    expect(account!.email).toBe('any_email@mail.com')
    expect(account!.password).toBe('hashed_password')
    expect(account!.accessToken).toBe('any_token')
    expect(account!.createdAt).toBe('any_date')
    expect(account!.authenticatedAt).toBe('any_date')
  })
})
