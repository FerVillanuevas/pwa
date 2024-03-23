import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { getSession, config } from "@/lib/commerce";
import { Search } from "commerce-sdk";
import Link from "next/link";
import type { NextRequest } from "next/server";

export default async function Home({
	request,
}: {
	request: NextRequest;
}) {
	const token = await getSession();
	const searchClient = new Search.ShopperSearch({
		...config,
		headers: {
			authorization: `Bearer ${token.access_token}`,
		},
	});

	const searchResults = await searchClient.productSearch({
		parameters: { q: "dress", limit: 8 },
	});

	console.log(token.customer_id);

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24 container">
			<Carousel>
				<CarouselContent>
					{searchResults?.hits?.map((hit) => {
						return (
							<CarouselItem key={hit.productId} className="basis-1/4">
								<Link
									href={`/product/${hit.representedProduct?.id}`}
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
							</CarouselItem>
						);
					})}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</main>
	);
}
