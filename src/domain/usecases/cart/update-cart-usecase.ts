export interface IUpdateCartUseCase {
  update(
    increment: boolean,
    decrement: boolean,
    promoCode: string
  ): Promise<void>
}
