export interface IUpdateClientAddressRepositoryModel {
  uid: string
  street?: string
  zipCode?: string
  district?: string
  city?: string
  country?: string
}

export interface IUpdateClientAddressRepository {
  update(dataToUpdate: IUpdateClientAddressRepositoryModel): Promise<void>
}
