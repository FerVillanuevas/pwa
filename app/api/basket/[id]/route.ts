import { getSession, config } from "@/lib/commerce";
import { Checkout } from "commerce-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
/*   const token = await getSession();

  const shopperBaskets = new Checkout.ShopperBaskets({
    ...config,
    headers: {
      authorization: `Bearer ${token?.access_token}`,
    },
  });


  console.log(shopperBaskets); */

/*   const basket = await shopperBaskets.addItemToBasket({
    parameters: {
      //@ts-ignore
      basketId: params.id,
    },
    body: req.body,
  }); */

  return NextResponse.json({
    hola: 'hola'
  });
}
