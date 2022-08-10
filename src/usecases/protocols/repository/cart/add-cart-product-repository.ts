export interface IAddCartProductRepository {
  add(uid: string, pid: string): Promise<void>
}
