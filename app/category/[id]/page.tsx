import { getSession, config } from "@/lib/commerce";
import { Product, Search } from "commerce-sdk";
import Link from "next/link";

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
			refine: [`cgid=${params.id}`, "orderable_only=true"],
		},
	});


	console.log(products)

	return (
		<div className="container">
			<div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
				<h1 className="text-4xl font-bold tracking-tight text-foreground">
					{category.name}
				</h1>
			</div>

			<section className="pt-6">
				<div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4 ">
					<div>div</div>

					<div className="col-span-3">
						<h2 className="sr-only">Products</h2>

						<div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
							{products?.hits?.map((hit) => {
								return (
									<Link
										href={`/product/${hit.productId}`}
										key={hit.productId}
										className="group"
									>
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
									</Link>
								);
							})}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
