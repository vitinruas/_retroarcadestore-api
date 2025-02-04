import { GetClientUseCase } from '../get-client-usecase'
import {
  IGetClientModel,
  IGetClientByUIDRepository
} from '../get-client-usecase-protocols'

const makeFakeValidClient = (): IGetClientModel => ({
  uid: 'any_uid',
  photo: 'any_photo',
  name: 'any_name',
  birthDay: 'any_date',
  email: 'any_email@mail.com',
  createdAt: 'any_date',
  authenticatedAt: 'any_date'
})

const makeGetClientByUIDRepositoryStub = (): IGetClientByUIDRepository => {
  class GetClientByUIDRepositoryStub implements IGetClientByUIDRepository {
    async get(uid: string): Promise<IGetClientModel> {
      return Promise.resolve(makeFakeValidClient())
    }
  }

  return new GetClientByUIDRepositoryStub()
}

interface ISut {
  sut: GetClientUseCase
  getClientByUIDRepositoryStub: IGetClientByUIDRepository
}

const makeSut = (): ISut => {
  const getClientByUIDRepositoryStub: IGetClientByUIDRepository =
    makeGetClientByUIDRepositoryStub()
  const sut: GetClientUseCase = new GetClientUseCase(
    getClientByUIDRepositoryStub
  )
  return {
    sut,
    getClientByUIDRepositoryStub
  }
}

describe('GetClientUseCase', () => {
  test('should call GetClientByUIDRepository with an uid', async () => {
    const { sut, getClientByUIDRepositoryStub }: ISut = makeSut()
    const getSpy = jest.spyOn(getClientByUIDRepositoryStub, 'get')

    await sut.get('any_uid')

    expect(getSpy).toHaveBeenCalledWith('any_uid')
  })

  test('should return throw if GetClientByUIDRepository throws', async () => {
    const { sut, getClientByUIDRepositoryStub }: ISut = makeSut()
    jest
      .spyOn(getClientByUIDRepositoryStub, 'get')
      .mockImplementationOnce(async () => Promise.reject(new Error()))

    const account: Promise<IGetClientModel> = sut.get('any_uid')

    expect(account).rejects.toThrow()
  })

  test('should returns an account if GetClientByUIDRepository succeeds', async () => {
    const { sut }: ISut = makeSut()

    const account = await sut.get('any_uid')

    expect(account).toEqual(makeFakeValidClient())
  })
})
