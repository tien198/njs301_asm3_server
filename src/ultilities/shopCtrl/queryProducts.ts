import { ICartItem } from "../../interfaces/user/user"
import Product from "../../models/product"

/**
 * Query products from the cart
 * @param cart - The cart items
 * @returns products and failed ids of the products that are not found
 */
export async function queryProducts(cart: ICartItem[]) {
    const queries = cart.map(i => Product.findById(i.productId).lean())
    const products = await Promise.all(queries)

    // index of the products that are not found
    const failedIndex: number[] = []
    products.forEach((i, index) => !i && failedIndex.push(index)) // if product is not found ( i === null ), add the index to the failedIndex array

    const failedIds = failedIndex.map(i => String(cart[i].productId)) // return not found ids of the products

    return {
        products, failedIds
    }
}