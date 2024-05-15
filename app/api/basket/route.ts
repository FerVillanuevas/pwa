import { createClient, getCustomerId } from "@/lib/commerce-kit";
import { Checkout } from "commerce-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const client = await createClient();
  const customerId = await getCustomerId();
  let basket: Checkout.ShopperBaskets.Basket | null;

  const baskets = await client.shopperCustomers.getCustomerBaskets({
    parameters: {
      //@ts-ignore
      customerId: customerId,
    },
  });

  if (baskets.total === 0) {
    basket = await client.shopperBaskets.createBasket({
      body: {
        customerInfo: {
          email: "",
          //@ts-ignore
          customerId: customerId,
        },
      },
    });
  } else {
    basket = baskets.baskets?.[0] || null;
  }

  return NextResponse.json({ ...basket });
}
