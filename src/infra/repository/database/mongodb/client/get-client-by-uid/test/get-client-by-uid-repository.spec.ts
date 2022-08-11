import { GetClientByUIDRepository } from '../get-client-by-uid-repository'
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
  createdAt: string
  authenticatedAt: string
}

const makeFakeAccount = (): IFakeAccount => ({
  name: 'any_name',
  birthDay: 'any_date',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  createdAt: 'any_date',
  authenticatedAt: 'any_date'
})

const addAccountToDB = async (fakeAccount: IFakeAccount): Promise<string> => {
  const createdAccountID = (
    await collectionRef.insertOne(fakeAccount)
  ).insertedId.toString()
  return createdAccountID
}

interface IFakeAddress {
  uid: any
  street: string
  zipCode: number
  district: string
  city: string
  country: string
  updatedAt: string
}
const makeFakeAddress = (uid: string): IFakeAddress => ({
  uid: mongoHelper.createMongoID(uid),
  street: 'any_street',
  zipCode: 1111111111,
  district: 'any_district',
  city: 'any_city',
  country: 'any_country',
  updatedAt: 'any_data'
})

const addAddressToDB = async (fakeAddress: IFakeAddress): Promise<any> => {
  const collectionRef = mongoHelper.getCollection('addresses')
  const createdAddressID = (
    await collectionRef.insertOne({
      ...fakeAddress
    })
  ).insertedId
  return createdAddressID
}

const makeSut = (): GetClientByUIDRepository => {
  return new GetClientByUIDRepository()
}

describe('GetClientByUIDRepository', () => {
  test('should return an account and its address with provided uid', async () => {
    const sut = makeSut()
    const createdAccountID = await addAccountToDB(makeFakeAccount())
    await addAddressToDB(makeFakeAddress(createdAccountID))

    const account = await sut.get(createdAccountID)

    expect(account!.uid).toBeTruthy()
    expect(account!.name).toBe('any_name')
    expect(account!.birthDay).toBe('any_date')
    expect(account!.email).toBe('any_email@mail.com')
    expect(account!.address?.aid).toBeTruthy()
    expect(account!.address?.uid).toBeTruthy()
    expect(account!.address?.street).toBe('any_street')
    expect(account!.address?.zipCode).toBe(1111111111)
    expect(account!.address?.district).toBe('any_district')
    expect(account!.address?.city).toBe('any_city')
    expect(account!.address?.country).toBe('any_country')
    expect(account!.address?.updatedAt).toBe('any_data')
    expect(account!.createdAt).toBe('any_date')
    expect(account!.authenticatedAt).toBe('any_date')
  })
})
