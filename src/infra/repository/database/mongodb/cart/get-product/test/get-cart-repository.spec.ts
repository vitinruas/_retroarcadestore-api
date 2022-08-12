import { MongoMemoryServer } from 'mongodb-memory-server'
import { Collection } from 'mongoose'
import mongoHelper from '../../../helpers/mongo-helper'
import { GetCartRepository } from '../get-cart-repository'
import {
  ICartEntitie,
  ICartProduct
} from '../../../../../../../domain/entities/cart/cart-entitie'
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

interface IFakeCart {
  uid: any
  products: ICartProduct[]
}

const makeFakeCart = (uid: string): IFakeCart => ({
  uid: mongoHelper.createMongoID(uid),
  products: [
    {
      pid: 'any_pid',
      quantity: 1,
      price: 10.0
    }
  ]
})

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

const addCartToDB = async (fakeCart: IFakeCart): Promise<string> => {
  const createdProductID = (
    await collectionRef.insertOne(fakeCart)
  ).insertedId.toString()
  return createdProductID
}

const addClientToDB = async (fakeClient: IFakeClient): Promise<string> => {
  const createdClientID = (
    await collectionRef.insertOne(fakeClient)
  ).insertedId.toString()
  return createdClientID
}

const makeSut = (): GetCartRepository => new GetCartRepository()

describe('AddCartProductRepository', () => {
  test('should add product to cart', async () => {
    const sut: GetCartRepository = makeSut()

    collectionRef = mongoHelper.getCollection('accounts')
    const createdAccountID: string = await addClientToDB(makeFakeClient())

    collectionRef = mongoHelper.getCollection('carts')
    await addCartToDB(makeFakeCart(createdAccountID))

    const cart: ICartEntitie | null = await sut.get(createdAccountID)

    expect(cart!.cid).toBeTruthy()
    expect(cart!.uid).toBeTruthy()
    expect(cart!.products[0].pid).toBe('any_pid')
    expect(cart!.products[0].quantity).toBe(1)
    expect(cart!.products[0].price).toBe(10.0)
  })
})
