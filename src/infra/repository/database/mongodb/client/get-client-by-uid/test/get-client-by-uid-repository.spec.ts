import { GetClientByUIDRepository } from '../get-client-by-uid-repository'
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

interface IFakeValidAccount {
  name: string
  birthDay: string
  email: string
  password: string
  createdAt: string
  authenticatedAt: string
}

const makeFakeValidAccount = (): IFakeValidAccount => ({
  name: 'any_name',
  birthDay: 'any_date',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  createdAt: 'any_date',
  authenticatedAt: 'any_date'
})

const addAccountToDB = async (
  fakeValidAccount: IFakeValidAccount
): Promise<any> => {
  const createdAccountID = (await collectionRef.insertOne(fakeValidAccount))
    .insertedId
  return createdAccountID
}

interface IFakeValidAddress {
  uid: any
  street: string
  zipCode: number
  district: string
  city: string
  country: string
  updatedAt: string
}
const makeFakeValidAddress = (uid: string): IFakeValidAddress => ({
  uid: new mongoose.Types.ObjectId(uid),
  street: 'any_street',
  zipCode: 1111111111,
  district: 'any_district',
  city: 'any_city',
  country: 'any_country',
  updatedAt: 'any_data'
})

const addAddressToDB = async (
  fakeValidAddress: IFakeValidAddress
): Promise<any> => {
  const collectionRef = mongoHelper.getCollection('addresses')
  const createdAddressID = (
    await collectionRef.insertOne({
      ...fakeValidAddress
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
    const createdAccountID = await addAccountToDB(makeFakeValidAccount())
    await addAddressToDB(makeFakeValidAddress(createdAccountID))

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
