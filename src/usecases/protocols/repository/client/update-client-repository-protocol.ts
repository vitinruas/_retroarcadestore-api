export interface IUpdateClientRepositoryModel {
  uid: string
  name?: string
  photo?: string
  email?: string
  password?: string
}

export interface IUpdateClientRepository {
  update(dataToUpdate: IUpdateClientRepositoryModel): Promise<void>
}
