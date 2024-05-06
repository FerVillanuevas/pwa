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
						({ id }) => id === category.id,
					);

					if (!subCategory?.categories?.length) {
						return (
							<NavigationMenuItem key={category.id}>
								<Link href={`/category/${category.id}`} legacyBehavior passHref>
									<NavigationMenuLink className={navigationMenuTriggerStyle()}>
									{category.name}
									</NavigationMenuLink>
								</Link>
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
										alt={category.name || ''}
									/>
								)}
								<ul className="grid gap-3 p-3 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
									{subCategory?.categories?.map(
										(category: Product.ShopperProducts.Category) => {
											return (
												<ListItem
													href={`/category/${category.id}`}
													key={category.id}
													title={category.name}
												>
													{category.description || category.pageDescription}
												</ListItem>
											);
										},
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

const ListItem = forwardRef<
	ElementRef<"a">,
	ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className,
					)}
					{...props}
				>
					<div className="text-sm font-medium leading-none">{title}</div>
					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = "ListItem";
