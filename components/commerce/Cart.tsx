import Link from "./Link";
import { ShoppingBasketIcon } from "lucide-react";
import { getSession } from "@/lib/commerce";
import { Badge } from "../ui/badge";
import type { ShopperBaskets } from "commerce-sdk/dist/checkout/checkout";
import composable from "@/lib/global";

export default async function Cart() {
  let basket: ShopperBaskets.Basket | null = null;
  const token = await getSession();

  if (!token) return <div>error</div>;

  const { shopperCustomers } = composable;

  const baskets = await shopperCustomers.getCustomerBaskets({
    parameters: {
      //@ts-ignore
      customerId: token.customer_id,
    },
    headers: {
      authorization: `Bearer ${token.access_token}`,
    },
    next: { tags: ["basket"] },
  });

  if (baskets.total !== 0 && baskets.baskets) {
    basket = baskets.baskets[0];
  }

  return (
    <div className="relative">
      <Link
        href="/cart"
        variant="outline"
        size="icon"
        className="justify-center w-auto px-1.5"
      >
        <ShoppingBasketIcon className="h-[1.2rem] w-[1.2rem]" />
        {basket?.productItems?.length && (
          <Badge variant="destructive" className="px-1 py-0.5">
            {basket?.productItems.length}
          </Badge>
        )}
      </Link>
    </div>
  );
}
