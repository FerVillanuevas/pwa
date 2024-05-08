import { getSession } from "@/lib/commerce";
import { ModeToggle } from "../mode-toggle";
import Link from "./Link";
import { NavigationMenu } from "./NavigationMenu";
import composable from "@/lib/global";
import MobileMenu from "./mobile-menu";
import SearchSheet from "./search-sheet";
import dynamic from "next/dynamic";

const Cart = dynamic(() => import("./Cart"), {
  loading: () => <p>Loading...</p>,
});

export default async function Header() {
  const token = await getSession();

  if (!token) return <div>empty</div>;

  const { shopperProducts } = composable;

  const { categories } = await shopperProducts.getCategory({
    parameters: {
      id: "root",
      levels: 1,
    },
    headers: {
      authorization: `Bearer ${token.access_token}`,
    },
  });

  const ids = categories?.flatMap((cat) => cat.id);

  const { data: subCategories } = await shopperProducts.getCategories({
    parameters: {
      //@ts-ignore
      ids: ids?.join(),
      levels: 2,
    },
    headers: {
      authorization: `Bearer ${token.access_token}`,
    },
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 justify-between items-center space-x-4 px-4 container">
        <MobileMenu categories={categories} subCategories={subCategories} />
        <Link href="/">#Commer Arch</Link>
        <nav className="md:flex items-center gap-1 text-sm hidden">
          <NavigationMenu
            categories={categories}
            subCategories={subCategories}
          />
        </nav>
        <div className="flex items-center space-x-2 ">
          <SearchSheet />

          <Cart />

          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
