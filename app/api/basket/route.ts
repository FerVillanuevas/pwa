import { getSession, config } from "@/lib/commerce";
import { Checkout, Customer } from "commerce-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getSession();
  let basket: Checkout.ShopperBaskets.Basket | null;

  const shopperBaskets = new Checkout.ShopperBaskets({
    ...config,
    headers: {
      authorization: `Bearer ${token?.access_token}`,
    },
  });

  const shopperCustomers = new Customer.ShopperCustomers({
    ...config,
    headers: {
      authorization: `Bearer ${token?.access_token}`,
    },
  });

  const baskets = await shopperCustomers.getCustomerBaskets({
    parameters: {
      //@ts-ignore
      customerId: token?.customer_id,
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
    });
  } else {
    basket = baskets.baskets?.[0] || null;
  }

  return NextResponse.json({ ...basket });
}
