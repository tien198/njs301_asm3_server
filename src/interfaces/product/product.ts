import { Types } from "mongoose"

export default interface IProduct {
    _id: Types.ObjectId
    category: 'ipad' | 'iphone' | 'watch' | 'macbook' | 'airpod'
    img1: string
    img2: string
    img3: string
    img4: string
    long_desc: string
    name: string
    price: string | number
    short_desc: string
}
