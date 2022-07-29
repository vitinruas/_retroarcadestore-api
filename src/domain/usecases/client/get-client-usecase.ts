export interface IGetClientModel {
  uid: string
  name: string
  photo?: string
  email: string
  street?: string
  postalCode?: number
  district?: string
  city?: string
  country?: string
  createdAt: string
  authenticatedAt: string
}

export interface IGetClientUseCase {
  get(uid: string): Promise<IGetClientModel>
}
