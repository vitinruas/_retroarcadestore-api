interface ICartProduct {
  pid: string
  quantity: number
  price?: number
}
export interface ICartEntitie {
  cid: string
  uid: string
  products: ICartProduct[]
}
