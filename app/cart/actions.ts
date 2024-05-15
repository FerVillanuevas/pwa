"use server";

import { createClient } from "@/lib/commerce-kit";

export async function getProducts(ids: string) {
  const client = await createClient();

  const products = await client.shopperProducts.getProducts({
    parameters: {
      ids: ids,
      allImages: true,
    },
  });

  return products;
}

export default async function getBasket(basketId: string) {
  const client = await createClient();

  const basket = await client.shopperBaskets.getBasket({
    parameters: {
      basketId: basketId,
    },
  });

  return basket;
}
