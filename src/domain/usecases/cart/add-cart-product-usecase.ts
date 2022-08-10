export interface IAddCartProductUseCase {
  add(pid: string): Promise<boolean>
}
