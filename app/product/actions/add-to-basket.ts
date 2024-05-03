"use server";

import { config, getSession } from "@/lib/commerce";
import {
  helpers,
  ShopperLogin,
  ShopperSearch,
  ShopperBaskets,
} from "commerce-sdk-isomorphic";
import { revalidateTag } from "next/cache";

export default async function AddToBasketAction(
  basketId: string,
  product: any
) {
  const token = await getSession();

  const sp = new ShopperBaskets({
    ...config,
    headers: {
      authorization: `Bearer ${token?.access_token}`,
    },
  });

  sp.addItemToBasket({
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
  });

  revalidateTag("basket");
}
