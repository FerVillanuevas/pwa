import { getSession, config } from "@/lib/commerce";
import { ModeToggle } from "../mode-toggle";
import Link from "./Link";
import { Product } from "commerce-sdk";
import { NavigationMenu } from "./NavigationMenu";
import Cart from "./Cart";

export default async function Header() {
	const token = await getSession();

	if(!token) return <div>empty</div>;

	const shopperProducts = new Product.ShopperProducts({
		...config,
		headers: {
			authorization: `Bearer ${token.access_token}`,
		},
	});

	const {categories} = await shopperProducts.getCategory({
		parameters: {
			id: "root",
			levels: 1,
		},
	});

    const ids = categories?.flatMap((cat) => cat.id);

    const {data: subCategories} = await shopperProducts.getCategories({
        parameters: {
			//@ts-ignore
            ids: ids?.join(),
            levels: 2
        }
    })
  

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 max-w-screen-2xl items-center space-x-4">
				<nav className="flex items-center gap-1 text-sm">
					<Link href="/">#Commer Arch</Link>
					<NavigationMenu categories={categories} subCategories={subCategories} />
				</nav>

				<div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
					<Cart />
					<ModeToggle />
				</div>
			</div>
		</header>
	);
}
