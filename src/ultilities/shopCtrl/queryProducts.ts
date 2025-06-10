import { ICartItem } from "../../interfaces/user/user"
import Product from "../../models/product"

/**
 * Query products from the cart
 * @param cart - The cart items
 * @returns products that are found
 */
export async function queryProducts(cart: ICartItem[]) {
    const queries = cart.map(i => Product.findById(i.productId).lean())
    const products = await Promise.all(queries)

    // remove products that are not found ( p === null )
    return products.filter(p => p !== null)
}