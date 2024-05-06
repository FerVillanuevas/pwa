"use server";

import { getSession } from "@/lib/commerce";
import composable from "@/lib/global";

export async function getProducts(ids: string) {
  const token = await getSession();

  const { shopperProducts } = composable;

  const products = await shopperProducts.getProducts({
    parameters: {
      ids: ids,
      allImages: true,
    },
    headers: {
      authorization: `Bearer ${token?.access_token}`,
    },
  });

  return products;
}

export default async function getBasket(basketId: string) {
  const token = await getSession();

  const { shopperBaskets } = composable;

  const basket = await shopperBaskets.getBasket({
    parameters: {
      basketId: basketId,
    },
    headers: {
      authorization: `Bearer ${token?.access_token}`,
    },
  });

  return basket;
}
