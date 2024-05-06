"use server";

import { getSession } from "@/lib/commerce";
import composable from "@/lib/global";
import { revalidateTag } from "next/cache";

export default async function AddToBasketAction(
  basketId: string,
  product: any
) {
  const token = await getSession();

  const { shopperBaskets } = composable;

  const basket = shopperBaskets.addItemToBasket({
    parameters: {
      basketId: basketId,
    },
    body: [
      {
        productId: product.productId,
        price: product.price,
        quantity: 1,
      },
    ],
    headers: {
      authorization: `Bearer ${token?.access_token}`,
    },
  });

  revalidateTag('basket');
  
  return basket;
}
