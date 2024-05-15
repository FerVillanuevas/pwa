import { AuthTypes } from "@/lib/commerce";
import { ModeToggle } from "../mode-toggle";
import { NavigationMenu } from "./NavigationMenu";
import MobileMenu from "./mobile-menu";
import SearchSheet from "./search-sheet";
import dynamic from "next/dynamic";
import LoginDialog from "./login-dialog";
import CustomerMenu from "./customer-menu";
import Logo from "./logo";
import { createClient, getSession } from "@/lib/commerce-kit";

const Cart = dynamic(() => import("./Cart"), {
  loading: () => <p>Loading...</p>,
});

export default async function Header() {
  const client = await createClient();
  const session = await getSession();

  const { categories } = await client.shopperProducts.getCategory({
    parameters: {
      id: "root",
      levels: 1,
    }
  });

  const ids = categories?.flatMap((cat) => cat.id);

  const { data: subCategories } = await client.shopperProducts.getCategories({
    parameters: {
      //@ts-ignore
      ids: ids?.join(),
      levels: 2,
    }
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 md:container">
        <MobileMenu categories={categories} subCategories={subCategories} />
        <Logo />
        <nav className="md:flex items-center gap-1 text-sm hidden">
          <NavigationMenu
            categories={categories}
            subCategories={subCategories}
          />
        </nav>
        <div className="flex items-center space-x-2 ">
          {session.type === AuthTypes.Guest ? (
            <LoginDialog />
          ) : (
            <CustomerMenu />
          )}

          <SearchSheet />

          <Cart />

          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
