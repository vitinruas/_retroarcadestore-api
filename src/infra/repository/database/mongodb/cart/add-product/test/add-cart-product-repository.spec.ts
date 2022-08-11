import { IAvaliationEntitie } from '../../../../../../../domain/entities/product/avaliation-entitie'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Collection } from 'mongoose'
import mongoHelper from '../../../helpers/mongo-helper'
import { AddCartProductRepository } from '../add-cart-product-respository'
import { IAddAccountModel } from '../../../account/add-account/add-account-repository.protocols'

let mongod: MongoMemoryServer
let collectionRef: Collection = mongoHelper.getCollection('any_collection')

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
  await collectionRef.deleteMany({})
})

interface IFakeProduct {
  category: 'games' | 'clothes' | 'accessories'
  name: string
  bannerImage: string
  cardImage: string
  previewImages: string[]
  description: string
  avaliations?: IAvaliationEntitie[]
  quantity: number | 'isGame'
  price: number
  discount: number
  createdAt: string
  isEnabled?: boolean
  updatedAt?: string
}

interface IFakeClient {
  name: string
  email: string
  password: string
}

const makeFakeClient = (): IAddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

const makeFakeProduct = (): IFakeProduct => ({
  name: 'any_name',
  category: 'games',
  bannerImage: 'any_image',
  cardImage: 'any_image',
  previewImages: ['any_image', 'any_image', 'any_image'],
  description: 'any_description',
  avaliations: [
    {
      aid: 'any_aid',
      uid: 'any_uid',
      photo: 'any_photo',
      comment: 'any_comment',
      stars: 4
    }
  ],
  quantity: 'isGame',
  price: 10.0,
  discount: 0,
  createdAt: 'any_date'
})

const addProductToDB = async (fakeProduct: IFakeProduct): Promise<string> => {
  const createdProductID = (
    await collectionRef.insertOne(fakeProduct)
  ).insertedId.toString()
  return createdProductID
}

const addClientToDB = async (fakeClient: IFakeClient): Promise<string> => {
  const createdClientID = (
    await collectionRef.insertOne(fakeClient)
  ).insertedId.toString()
  return createdClientID
}

const makeSut = (): AddCartProductRepository => new AddCartProductRepository()

describe('AddCartProductRepository', () => {
  test('should add product to cart', async () => {
    const sut: AddCartProductRepository = makeSut()

    collectionRef = mongoHelper.getCollection('products')
    const createdProductID: string = await addProductToDB(makeFakeProduct())

    collectionRef = mongoHelper.getCollection('accounts')
    const createdAccountID: string = await addClientToDB(makeFakeClient())

    await sut.add(createdAccountID, createdProductID)

    collectionRef = mongoHelper.getCollection('carts')
    const createdCart = await collectionRef.find({}).toArray()
    console.log(createdCart[0])
    expect(createdCart[0]._id).toBeTruthy()
    expect(createdCart[0].uid).toEqual(
      mongoHelper.createMongoID(createdAccountID)
    )

    expect(createdCart[0].products[0]).toEqual({
      pid: mongoHelper.createMongoID(createdProductID),
      quantity: 0
    })
  })
})
