import { FlattenMaps } from "mongoose"
import ICartItem from "../../interfaces/user/cartItem"
import Product from "../../models/product"
import { IProduct } from "../../interfaces/product"

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
        if (!products[i])
            continue

        nnProducts.push(products[i]!)
        nnCart.push(cart[i])
    }

    return {
        products: nnProducts,
        cart: nnCart
    }
}