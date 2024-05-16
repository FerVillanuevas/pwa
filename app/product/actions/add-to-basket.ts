"use server";

import { createClient } from "@/lib/commerce-kit";
import { revalidateTag } from "next/cache";

export default async function AddToBasketAction(
  basketId: string,
  product: any
) {
  const client = await createClient();
  const basket = await client.shopperBaskets.addItemToBasket({
    parameters: {
      basketId: basketId,
    },
    body: [
      {
        productId: product.productId,
        price: product.price,
        quantity: 1,
      },
    ]
  });
  return basket;
}
