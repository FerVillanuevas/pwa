import { Checkout, Customer } from "commerce-sdk";
import Link from "./Link";
import { ShoppingBasketIcon } from "lucide-react";
import { getSession, config } from "@/lib/commerce";
import { Badge } from "../ui/badge";
import type { ShopperBaskets } from "commerce-sdk/dist/checkout/checkout";

export default async function Cart() {
	let basket: ShopperBaskets.Basket;
	const token = await getSession();

	const shopperCustomers = new Customer.ShopperCustomers({
		...config,
		headers: {
			authorization: `Bearer ${token.access_token}`,
		},
	});

	const baskets = await shopperCustomers.getCustomerBaskets({
		parameters: {
			customerId: token.customer_id,
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
