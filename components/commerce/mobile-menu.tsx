import { Menu, Package2 } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import Link from "./Link";
import { Product } from "commerce-sdk";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function MobileMenu({
  categories,
  subCategories,
}: {
  categories: Product.ShopperProducts.Category[] | undefined;
  subCategories: Product.ShopperProducts.Category[] | undefined;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold px-0"
          >
            <Package2 className="h-6 w-6" />
            <span>Acme Inc</span>
          </Link>

          <Accordion type="single" collapsible className="w-full">
            {categories?.map((category: Product.ShopperProducts.Category) => {
              const subCategory = subCategories?.find(
                ({ id }) => id === category.id
              );

              return (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger>{category.name}</AccordionTrigger>
                  <AccordionContent className="flex flex-col">
                    {subCategory?.categories?.map(
                      (category: Product.ShopperProducts.Category) => {
                        return (
                          <Link
                            href={`/category/${category.id}`}
                            key={category.id}
                          >
                            {category.name}
                          </Link>
                        );
                      }
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
