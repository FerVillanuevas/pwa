import { ModeToggle } from "@/components/mode-toggle";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getSession, config } from "@/lib/commerce";
import { Search } from "commerce-sdk";
import Link from "next/link";

export default async function Home() {
	const token = await getSession();
	const searchClient = new Search.ShopperSearch({
		...config,
		headers: {
			authorization: `Bearer ${token.access_token}`,
		},
	});

	const searchResults = await searchClient.productSearch({
		parameters: { q: "dress", limit: 150 },
	});

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24 container">
			
			<div className="grid grid-cols-4 gap-3 cion">
				{searchResults?.hits?.map((hit) => {
					return (
						<Card key={hit.productId} className="overflow-hidden">
							<img src={hit.image?.disBaseLink} alt={hit.image?.alt} />

							<CardHeader>
								<CardTitle>{hit.productName}</CardTitle>
								<CardDescription>${hit.price}</CardDescription>
							</CardHeader>
							<CardContent>
								<Link href={`/product/${hit.productId}`}>Ver</Link>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</main>
	);
}
