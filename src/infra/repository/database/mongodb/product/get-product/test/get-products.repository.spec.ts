import { IAvaliationEntitie } from '../../../../../../../domain/entities/product/avaliation-entitie'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Collection } from 'mongoose'
import mongoHelper from '../../../helpers/mongo-helper'
import { GetProductsRepository } from '../get-products-repository'
import { IProductEntitie } from '../../../../../../../domain/entities/product/product-entitie'

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
  collectionRef = mongoHelper.getCollection('products')
  await collectionRef.deleteMany({})
})

interface IFakeProduct {
  category: 'games' | 'clothes' | 'accessories'
  name: string
  mainImage: string
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

const makeFakeProduct = (): IFakeProduct => ({
  name: 'any_name',
  category: 'games',
  mainImage: 'any_image',
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

const addProductToDB = async (fakeProduct: IFakeProduct): Promise<any> => {
  const createdProductID = (
    await collectionRef.insertOne(fakeProduct)
  ).insertedId.toString()
  return createdProductID
}

const makeSut = () => new GetProductsRepository()

describe('GetProductsRepository', () => {
  test('should return only product if PID is provided', async () => {
    const sut = makeSut()
    const createdProductID = await addProductToDB(makeFakeProduct())

    const product: IProductEntitie | IProductEntitie[] | null = (await sut.get(
      createdProductID
    )) as IProductEntitie

    expect(product.pid).toBeTruthy()
    expect(product.name).toBe('any_name')
    expect(product.category).toBe('games')
    expect(product.mainImage).toBe('any_image')
    expect(product.previewImages).toEqual([
      'any_image',
      'any_image',
      'any_image'
    ])
    expect(product.description).toBe('any_description')
    expect(product.avaliations).toEqual([
      {
        aid: 'any_aid',
        uid: 'any_uid',
        photo: 'any_photo',
        comment: 'any_comment',
        stars: 4
      }
    ] as IAvaliationEntitie[])
    expect(product.quantity).toBe('isGame')
    expect(product.price).toBe(10.0)
    expect(product.discount).toBe(0)
    expect(product.createdAt).toBe('any_date')
  })
  test('should return all created products', async () => {
    const sut = makeSut()
    await addProductToDB(makeFakeProduct())
    await addProductToDB(makeFakeProduct())
    await addProductToDB(makeFakeProduct())

    const products: IProductEntitie | IProductEntitie[] | null =
      (await sut.get()) as IProductEntitie[]

    expect(products[1].pid).toBeTruthy()
    expect(products[1].name).toBe('any_name')
    expect(products[1].category).toBe('games')
    expect(products[1].mainImage).toBe('any_image')
    expect(products[1].previewImages).toEqual([
      'any_image',
      'any_image',
      'any_image'
    ])
    expect(products[1].description).toBe('any_description')
    expect(products[1].avaliations).toEqual([
      {
        aid: 'any_aid',
        uid: 'any_uid',
        photo: 'any_photo',
        comment: 'any_comment',
        stars: 4
      }
    ] as IAvaliationEntitie[])
    expect(products[1].quantity).toBe('isGame')
    expect(products[1].price).toBe(10.0)
    expect(products[1].discount).toBe(0)
    expect(products[1].createdAt).toBe('any_date')
  })
})
