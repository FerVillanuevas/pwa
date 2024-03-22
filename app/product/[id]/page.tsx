import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { config, getSession } from "@/lib/commerce";
import { getVariantValueSwatch } from "@/lib/utils/commerce";
import { Product } from "commerce-sdk";

export default async function Page({ params }: { params: { id: string } }) {
	const token = await getSession();

	const shopperProducts = new Product.ShopperProducts({
		...config,
		headers: {
			authorization: `Bearer ${token.access_token}`,
		},
	});

	const product = await shopperProducts.getProduct({
		parameters: { id: params.id, allImages: true },
	});

	return (
		<div className="bg-background py-6">
			<div className="grid grid-cols-3 container gap-4">
				<div className="col-span-2">
					<div className="container w-full justify-center flex px-20">
						<Carousel>
							<CarouselContent>
								{product.imageGroups?.[0].images.map((image) => {
									return (
										<CarouselItem key={image.title}>
											<img
												className="w-full"
												src={image?.disBaseLink}
												alt={image?.alt}
											/>
										</CarouselItem>
									);
								})}
							</CarouselContent>
							<CarouselPrevious />
							<CarouselNext />
						</Carousel>
					</div>
				</div>

				<div className="col-span-1">
					<h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
						{product.name}
					</h1>

					<h2 className="sr-only">Product information</h2>
					<p className="text-3xl tracking-tight text-foreground mt-4">
						${product.price}
					</p>

					<div className="mt-10">
						<h3 className="sr-only">Description</h3>

						<div className="space-y-6 prose dark:prose-invert">
							{product.shortDescription}
						</div>
					</div>

					<div className="mt-10">
						<h2 className="text-sm font-medium text-foreground">Details</h2>

						<div className="mt-4 space-y-6 prose dark:prose-invert">
							{product.longDescription}
						</div>
					</div>

					<div className="mt-10 space-y-3">
						{product.variationAttributes?.map(({ id, values }) => {
							if (id === "color") {
								return (
									<div key={id} className="space-y-3">
										<p className="capitalize">{id}</p>
										<ul className="flex gap-3">
											{values?.map(({ name, orderable, value }) => {
												const sw = getVariantValueSwatch(product, value);
												return ( <li key={value}>
														<img className="ring-2 aspect-square rounded-full w-10 cursor-pointer" src={sw?.disBaseLink} alt={sw?.alt} />
													</li>
												);
											})}
										</ul>
									</div>
								);
							}

							return (
								<div key={id} className="space-y-3">
									<p className="capitalize">{id}</p>
									<ul className="flex gap-3">
										{values?.map(({ name, orderable, value }) => {
											return <li key={value} className="ring-2 w-10 aspect-square text-center flex items-center justify-center cursor-pointer">{value}</li>;
										})}
									</ul>
								</div>
							);
						})}
					</div>

					<form className="mt-10">
						<button
							type="submit"
							className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							Add to bag
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
