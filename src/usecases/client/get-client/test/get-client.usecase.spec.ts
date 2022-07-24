import { IClientEntitie } from '../../../../domain/entities/account/client-entitie'
import { IGetClientByUIDRepository } from '../../../protocols/repository/client/get-client-by-uid-repository-protocol'
import { GetClientUseCase } from '../get-client-usecase'

const makeFakeValidAccount = (): IClientEntitie => ({
  uid: 'any_uid',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  accessToken: 'any_token'
})

const makeGetClientByUIDRepositoryStub = (): IGetClientByUIDRepository => {
  class GetClientByUIDRepositoryStub implements IGetClientByUIDRepository {
    async get(uid: string): Promise<IClientEntitie> {
      return Promise.resolve(makeFakeValidAccount())
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

    const account: Promise<IClientEntitie> = sut.get('any_uid')

    expect(account).rejects.toThrow()
  })

  test('should returns an account if GetClientByUIDRepository succeeds', async () => {
    const { sut }: ISut = makeSut()

    const account = await sut.get('any_uid')

    expect(account).toEqual(makeFakeValidAccount())
  })
})
