import { UpdateClientAddressRepository } from '../update-client-address-repository'
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
  collectionRef = mongoHelper.getCollection('addresses')
  await collectionRef.deleteMany({})
})

interface IFakeValidAddress {
  uid: string
  street: string
  zipCode: string
  district: string
  city: string
  country: string
  updatedAt?: string
}
const makeFakeValidAddress = (): IFakeValidAddress => ({
  uid: 'any_id',
  street: 'any_street',
  zipCode: '11111-1111',
  district: 'any_district',
  city: 'any_city',
  country: 'any_country'
})

const addAddressToDB = async (
  fakeValidAddress: IFakeValidAddress
): Promise<any> => {
  const createdAddressID = (await collectionRef.insertOne(fakeValidAddress))
    .insertedId
  return createdAddressID
}

const makeSut = (): UpdateClientAddressRepository => {
  return new UpdateClientAddressRepository()
}

describe('UpdateClientAddressRepository', () => {
  test('should update client address', async () => {
    const createdAddressID = await addAddressToDB(makeFakeValidAddress())

    const sut = makeSut()

    await sut.update({
      uid: createdAddressID,
      street: 'new_street',
      zipCode: '22222-2222',
      district: 'new_district',
      city: 'new_city',
      country: 'new_country'
    })

    const address = await collectionRef.findOne({
      _id: new mongoose.Types.ObjectId(createdAddressID.toString())
    })
    expect(address!._id).toBeTruthy()
    expect(address!.street).toBe('new_street')
    expect(address!.zipCode).toBe('22222-2222')
    expect(address!.district).toBe('new_district')
    expect(address!.city).toBe('new_city')
    expect(address!.country).toBe('new_country')
    expect(address!.updatedAt).toBeTruthy()
  })
})
