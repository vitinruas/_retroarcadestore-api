import { GetAccountByAccessTokenRepository } from '../get-account-by-access-token-repository'
import { IAccountEntitie } from '../get-account-by-access-token-repository-protocols'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoHelper from '../../../helpers/mongo-helper'
import { Collection } from 'mongoose'

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

const makeFakeValidAccount = (admin: boolean) => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  accessToken: 'any_token',
  isAdmin: admin
})

const makeSut = (): GetAccountByAccessTokenRepository => {
  return new GetAccountByAccessTokenRepository()
}

describe('GetAccountByAccessTokenRepository', () => {
  test('should return a client account if using the provided access token', async () => {
    const sut = makeSut()
    await collectionRef.insertOne(makeFakeValidAccount(false))

    const account: IAccountEntitie | null = await sut.get('any_token', false)

    expect(account!.uid).toBeTruthy()
    expect(account!.name).toBe('any_name')
    expect(account!.email).toBe('any_email@mail.com')
    expect(account!.password).toBe('hashed_password')
    expect(account!.accessToken).toBe('any_token')
    expect(account!.isAdmin).toBe(false)
  })

  test('should return an admin account if using the provided access token', async () => {
    const sut = makeSut()
    await collectionRef.insertOne(makeFakeValidAccount(true))

    const account: IAccountEntitie | null = await sut.get('any_token', true)

    expect(account!.uid).toBeTruthy()
    expect(account!.name).toBe('any_name')
    expect(account!.email).toBe('any_email@mail.com')
    expect(account!.password).toBe('hashed_password')
    expect(account!.accessToken).toBe('any_token')
    expect(account!.isAdmin).toBe(true)
  })
})
