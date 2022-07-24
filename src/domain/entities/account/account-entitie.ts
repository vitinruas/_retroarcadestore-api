export interface IAccountEntitie {
  id: string
  name: string
  email: string
  password: string
  accessToken: string
  isAdmin?: boolean
  createdAt?: string
  updatedAt?: string
  authenticatedAt?: string
  isClosed?: boolean
  closedAt?: string
}
