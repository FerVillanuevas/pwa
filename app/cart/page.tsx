import { getSession, config } from "@/lib/commerce";
import { Checkout, Customer } from "commerce-sdk";

export default async function Page() {

	let basket: Checkout.ShopperBaskets.Basket | null;
	const token = await getSession();

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
			customerId: token?.customer_id
		},
		next: { tags: ['basket'] }
	})

	if(baskets.total === 0 ) {
		basket = await shopperBaskets.createBasket({
			body: {
				customerInfo: {
					email: '',
					customerId: token?.customer_id
				}
			}
		})
	} else {
		basket = baskets.baskets?.[0] || null;
	}

    return <div className="container"> 
		<div className="grid grid-cols-4">
			<div className="col-span-3">
				{basket?.productItems?.map((productItem) => {
					return <div key={productItem.itemId}>
						{productItem.productName}
						{productItem.price}
					</div>
				})}
			</div>
			<div className="col-span-1">
				<h1>Summary</h1>

				Subtotal: {basket?.productSubTotal}
				Shipping:  {basket?.shippingTotal}
				tax: {basket?.taxTotal}

				Estimated Total: {basket?.productTotal}

			</div>
		</div>
	
	</div>
}