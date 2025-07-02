import { Types } from "mongoose"

export interface IProduct {
    _id: Types.ObjectId
    name: string
    category: string
    sku: string
    long_desc: string
    price: string | number
    short_desc: string
    img1: string
    img2: string
    img3: string
    img4: string
    img5: string
    totalQuantity: number
    availableQuantity: number
    reservedQuantity: number
}
