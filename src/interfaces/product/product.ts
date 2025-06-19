import { Types } from "mongoose"

export interface IProduct {
    _id: Types.ObjectId
    name: string
    category: string
    img1: string
    img2: string
    img3: string
    img4: string
    long_desc: string
    price: string | number
    short_desc: string
}
