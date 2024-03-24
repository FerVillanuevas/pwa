import { getSession, config } from "@/lib/commerce";
import { Checkout, Customer, Product, Search } from "commerce-sdk";
import Image from "next/image";

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

	const shopperProducts = new Product.ShopperProducts({
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
		next: { tags: ["basket"] },
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

	const products = await shopperProducts.getProducts({
		parameters: {
			ids: basket?.productItems?.map(({ productId }) => productId).join(),
			allImages: true,
		},
	});

	const findColorImage = (
		fullProduct,
		productItem,
	): Product.ShopperProducts.Image | null => {
		const images = fullProduct?.imageGroups?.filter(
			({ viewType, variationAttributes }) =>
				viewType === "small" && variationAttributes,
		);

		const color = fullProduct?.variationAttributes?.find(
			({ id }) => id === "color",
		)?.values?.[0].value;
		const colorImages = images?.find(({ variationAttributes }) =>
			variationAttributes?.find(
				({ id, values }) =>
					id === "color" && values?.find(({ value }) => value === color),
			),
		);

		if (colorImages) {
			return colorImages.images[0];
		}
		const imagesLarge = fullProduct?.imageGroups?.find(
			({ viewType }) => viewType === "large",
		);
		return imagesLarge?.images[0] || null;
	};

	return (
		<div className="container">
			<div className="grid grid-cols-6 gap-4">
				<div className="col-span-4">
					<ul className="divide-y py-4">
						{basket?.productItems?.map((productItem) => {
							const fullProduct = products.data?.find(
								({ id }: { id: string }) => id === productItem.productId,
							);
							const image = findColorImage(fullProduct, productItem);
							return (
								<li key={productItem.itemId} className="flex py-6">
									<div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border ">
										{image && (
											<Image
												src={image.disBaseLink}
												alt={image.alt}
												width={100}
												height={100}
											/>
										)}
									</div>

									<div className="ml-4 flex flex-1 flex-col">
										<div>
											<div className="flex justify-between text-base font-medium text-foreground">
												<h3>{productItem.productName}</h3>
												<p className="ml-4">${productItem.price}</p>
											</div>
											<p className="mt-1 text-sm text-foreground">Salmon</p>
										</div>
										<div className="flex flex-1 items-end justify-between text-sm">
											<p className="text-foreground">Qty 1</p>

											<div className="flex">
												<button
													type="button"
													className="font-medium text-indigo-600 hover:text-indigo-500"
												>
													Remove
												</button>
											</div>
										</div>
									</div>
								</li>
							);
						})}
					</ul>
				</div>
				<div className="col-span-2 py-4 space-y-4 text-sm font-medium">
					<h1 className="text-xl font-bold">Summary</h1>
					<div className="flex justify-between">
						<b>Subtotal:</b> ${basket?.productSubTotal}
					</div>
					<div className="flex justify-between">
						<b>Shipping:</b> ${basket?.shippingTotal}
					</div>
					<div className="flex justify-between">
						<b>tax:</b> ${basket?.taxTotal}
					</div>
					<div className="flex justify-between">
						<b>Estimated Total:</b> ${basket?.productTotal}
					</div>
				</div>
			</div>
		</div>
	);
}
