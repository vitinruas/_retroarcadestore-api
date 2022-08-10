export interface IAddCartProductUseCase {
  add(uid: string, pid: string): Promise<boolean>
}
