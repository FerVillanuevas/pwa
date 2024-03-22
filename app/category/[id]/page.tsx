import { getSession, config } from "@/lib/commerce";
import { Product, Search } from "commerce-sdk";

export default async function Page({ params }: { params: { id: string } }) {
	const token = await getSession();

	const shopperProducts = new Product.ShopperProducts({
		...config,
		headers: {
			authorization: `Bearer ${token.access_token}`,
		},
	});

	const shopperSearch = new Search.ShopperSearch({
		...config,
		headers: {
			authorization: `Bearer ${token.access_token}`,
		},
	});

	const category = await shopperProducts.getCategory({
		parameters: {
			id: params.id,
		},
	});

	const products = await shopperSearch.productSearch({
		parameters: {
			refine: [`cgid=${params.id}`],
		},
	});

	return (
		<div className="bg-background py-6">
			<div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
				<h2 className="sr-only">Products</h2>

				<div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
					{products.hits.map((hit) => {
						return (
							<div className="group">
								<div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
									<img
										src={hit.image?.disBaseLink}
										className="h-full w-full object-cover object-center group-hover:opacity-75"
										alt={hit.image?.alt}
									/>
								</div>
								<h3 className="mt-4 text-sm text-foreground">
									{hit.productName}
								</h3>
								<p className="mt-1 text-lg font-medium text-secondary-foreground">
									${hit.price}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
