import { IAccountEntitie } from '../../account/authentication/authentication-usecase-protocols'
import {
  IUpdateClientUseCase,
  IGetAccountByUIDRepository,
  IHashComparer,
  IHasher,
  IUpdateClientRepository,
  IUpdateClientUseCaseModel,
  IUpdateClientAddressRepository
} from './update-client-usecase-protocols'

export class UpdateClientUseCase implements IUpdateClientUseCase {
  constructor(
    private readonly getAccountByUIDRepository: IGetAccountByUIDRepository,
    private readonly passwordHashComparerAdapter: IHashComparer,
    private readonly passwordHasherAdapter: IHasher,
    private readonly updateClientRepository: IUpdateClientRepository,
    private readonly updateClientAddressRepository: IUpdateClientAddressRepository
  ) {}

  async update(fields: IUpdateClientUseCaseModel): Promise<boolean> {
    const { newPassword, password, ...fieldsWithOutNewPassword } = fields
    const userFields = ['uid', 'name', 'photo', 'email', 'password']

    const addressFields = [
      'uid',
      'street',
      'postalCode',
      'district',
      'city',
      'country'
    ]

    const userDataToUpdate: any = {}
    const addressDataToUpdate: any = {}

    for (const [key, value] of Object.entries(fieldsWithOutNewPassword)) {
      if (userFields.includes(key)) {
        userDataToUpdate[key] = value
      }
      if (addressFields.includes(key)) {
        addressDataToUpdate[key] = value
      }
    }

    // check if a password was provided
    if (fields.password) {
      const account: IAccountEntitie = await this.getAccountByUIDRepository.get(
        fields.uid
      )
      // check if the password is valid
      const isValid: boolean = await this.passwordHashComparerAdapter.compare(
        fields.password,
        account.password
      )
      // if invalid then returns false
      if (!isValid) {
        return false
      }
      if (newPassword) {
        const hashedPassword = await this.passwordHasherAdapter.hash(
          newPassword
        )

        Object.assign(userDataToUpdate, {
          password: hashedPassword || account.password
        })
      }
    }
    await this.updateClientRepository.update(userDataToUpdate)
    await this.updateClientAddressRepository.update(addressDataToUpdate)
    return true
  }
}
