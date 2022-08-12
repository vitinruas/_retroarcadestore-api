export interface IUpdateCartUseCase {
  update(
    uid: string,
    pid: string | null,
    increment: boolean,
    decrement: boolean,
    promoCode: string
  ): Promise<void>
}
