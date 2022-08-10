interface ICartProduct {
  pid: string
  quantity: string
}
export interface ICartEntitie {
  cid: string
  uid: string
  products: ICartProduct[]
}
