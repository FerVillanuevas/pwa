"use client";

import { cn } from "@/lib/utils";
import {
  NavigationMenu as NavigationMenuPrimary,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import type { Product } from "commerce-sdk";
import Link from "next/link";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import Image from "next/image";

export function NavigationMenu({
  categories,
  subCategories,
}: {
  categories: Product.ShopperProducts.Category[] | undefined;
  subCategories: Product.ShopperProducts.Category[] | undefined;
}) {
  return (
    <NavigationMenuPrimary>
      <NavigationMenuList>
        {categories?.map((category: Product.ShopperProducts.Category) => {
          const subCategory = subCategories?.find(
            ({ id }) => id === category.id
          );

          if (!subCategory?.categories?.length) {
            return (
              <NavigationMenuItem key={category.id}>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  asChild
                >
                  <Link href={`/category/${category.id}`}>{category.name}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          }

          return (
            <NavigationMenuItem key={category.id}>
              <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>
              <NavigationMenuContent>
                {category.c_slotBannerImage && (
                  <Image
                    width={500}
                    height={200}
                    className="flex h-full w-full select-none"
                    src={category.c_slotBannerImage}
                    alt={category.name || ""}
                  />
                )}
                <ul className="grid gap-3 p-3 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  {subCategory?.categories?.map(
                    (category: Product.ShopperProducts.Category) => {
                      return (
                        <li key={category.id}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={`/category/${category.id}`}
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              )}
                            >
                              <div className="text-sm font-medium leading-none">
                                {category.name}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {category.description ||
                                  category.pageDescription}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      );
                    }
                  )}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenuPrimary>
  );
}
