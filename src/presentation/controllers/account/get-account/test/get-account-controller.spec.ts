import { IGetAccountUseCase } from '../../../../../domain/usecases/account/get-account-usecase'
import { IAccountEntitie } from '../../../../middlewares/auth-middleware-protocols'
import { IHttpRequest } from '../../authentication/login/login-controller-protocols'
import { GetAccountController } from '../get-account-controller'

describe('GetAccountUseCase', () => {
  test('should call GetAccountUseCase with an user id', async () => {
    class GetAccountUseCaseStub implements IGetAccountUseCase {
      get(id: string): Promise<IAccountEntitie> {
        return Promise.resolve({
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'hashed_password',
          accessToken: 'any_token'
        })
      }
    }
    const getAccountUseCaseStub: IGetAccountUseCase =
      new GetAccountUseCaseStub()
    const sut = new GetAccountController(getAccountUseCaseStub)
    const getSpy = jest.spyOn(getAccountUseCaseStub, 'get')
    const httpRequest: IHttpRequest = {
      body: {
        id: 'any_id'
      }
    }
    await sut.perform(httpRequest)
    expect(getSpy).toHaveBeenCalledWith('any_id')
  })
})
