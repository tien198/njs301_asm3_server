import { Types } from "mongoose"

export default interface IProduct {
    _id: Types.ObjectId
    name: string
    category: {
        _id: Types.ObjectId
        name: string
    }
    img1: string
    img2: string
    img3: string
    img4: string
    long_desc: string
    price: string | number
    short_desc: string
}
