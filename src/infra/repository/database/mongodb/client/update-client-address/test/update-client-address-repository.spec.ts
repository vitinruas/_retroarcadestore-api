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
  uid: any
  street: string
  zipCode: string
  district: string
  city: string
  country: string
  updatedAt?: string
}
const makeFakeValidAddress = (): IFakeValidAddress => ({
  uid: new mongoose.Types.ObjectId('82f10266747f219e874fe9ff'),
  street: 'any_street',
  zipCode: '11111-1111',
  district: 'any_district',
  city: 'any_city',
  country: 'any_country'
})

const addAddressToDB = async (
  fakeValidAddress: IFakeValidAddress
): Promise<any> => {
  const createdAddressID = (
    await collectionRef.insertOne(fakeValidAddress)
  ).insertedId.toString()
  const createdAddress = await collectionRef.findOne({
    _id: new mongoose.Types.ObjectId(createdAddressID)
  })
  return createdAddress!.uid
}

const makeSut = (): UpdateClientAddressRepository => {
  return new UpdateClientAddressRepository()
}

describe('UpdateClientAddressRepository', () => {
  test('should update client address', async () => {
    const createdAddressUID = await addAddressToDB(makeFakeValidAddress())

    const sut = makeSut()

    await sut.update({
      uid: createdAddressUID,
      street: 'new_street',
      zipCode: '22222-2222',
      district: 'new_district',
      city: 'new_city',
      country: 'new_country'
    })

    const updatedAddress = await collectionRef.findOne({
      uid: new mongoose.Types.ObjectId(createdAddressUID.toString())
    })

    expect(updatedAddress!._id).toBeTruthy()
    expect(updatedAddress!.street).toBe('new_street')
    expect(updatedAddress!.zipCode).toBe('22222-2222')
    expect(updatedAddress!.district).toBe('new_district')
    expect(updatedAddress!.city).toBe('new_city')
    expect(updatedAddress!.country).toBe('new_country')
    expect(updatedAddress!.updatedAt).toBeTruthy()
  })
})
