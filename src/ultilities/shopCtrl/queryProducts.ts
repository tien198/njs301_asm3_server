import type { ICartItem } from "../../interfaces/user/cartItem"
import type { FlattenMaps } from "mongoose"
import type { IProduct } from "../../interfaces/product"


import Product from "../../models/product"
import ErrorRes from "../../models/errorRes"
import { ResData } from "../../interfaces/response/error/resData"

/**
 * Query products from the cart
 * @param cart - The cart items
 * @returns products that are found
 */
export async function queryProducts(cart: ICartItem[]) {
    const queries = cart.map(i => Product.findById(i.productId).lean())
    const products = await Promise.all(queries)

    // remove products that are not found ( p === null )
    const nnProducts: FlattenMaps<IProduct>[] = []
    const nnCart = []

    for (let i = 0; i < products.length; i++) {
        nnProducts.push(products[i]!)
        nnCart.push(cart[i])
    }

    return {
        products: nnProducts,
        cart: nnCart
    }
}