export type StarsType = 1 | 2 | 3 | 4 | 5

export interface IAvaliationEntitie {
  aid: string
  uid: string
  photo: string
  comment: string
  stars: StarsType
}
