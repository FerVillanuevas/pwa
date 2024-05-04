import { getSession, config } from "@/lib/commerce";
import composable from "@/lib/global";
import { Checkout, Customer } from "commerce-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getSession();
  let basket: Checkout.ShopperBaskets.Basket | null;

  const { shopperBaskets, shopperCustomers } = composable;

  const baskets = await shopperCustomers.getCustomerBaskets({
    parameters: {
      //@ts-ignore
      customerId: token?.customer_id,
    },
    headers: {
      authorization: `Bearer ${token?.access_token}`,
    },
  });

  if (baskets.total === 0) {
    basket = await shopperBaskets.createBasket({
      body: {
        customerInfo: {
          email: "",
          //@ts-ignore
          customerId: token?.customer_id,
        },
      },
      headers: {
        authorization: `Bearer ${token?.access_token}`,
      },
    });
  } else {
    basket = baskets.baskets?.[0] || null;
  }

  return NextResponse.json({ ...basket });
}
