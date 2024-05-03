import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ViewTypes } from "@/enums/product";
import { config, getSession } from "@/lib/commerce";
import { cn } from "@/lib/utils";
import { getVariantValueSwatch } from "@/lib/utils/commerce";
import { Product } from "commerce-sdk";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import CartAction from "../components/cart-action";

interface IParams {
  params: { id: string };
  searchParams: { pid?: string; color?: string };
}

export default async function ProductView({ params, searchParams }: IParams) {
  const { pid, color } = searchParams;

  const token = await getSession();

  const shopperProducts = new Product.ShopperProducts({
    ...config,
    headers: {
      authorization: `Bearer ${token?.access_token}`,
    },
  });




  const product = await shopperProducts.getProduct({
    parameters: { id: pid || params.id, allImages: true },
  });

  const variant = product.variants?.find((variant) => {
    return Object.keys(variant.variationValues || {}).every((key) => {
      //@ts-ignore
      return searchParams[key] === variant.variationValues?.[key];
    });
  });

  const colorGroup = product.imageGroups?.find(
    ({ variationAttributes, viewType }) => {
      return (
        viewType === ViewTypes.LARGE &&
        variationAttributes?.find(({ values, id }) => {
          return values?.find(({ value }) => {
            return value === color;
          });
        })
      );
    }
  );

  const images = colorGroup?.images || product.imageGroups?.[0].images;

  return (
    <div className="container space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="container w-full justify-center flex px-20 sticky top-20">
            <Carousel>
              <CarouselContent>
                {images?.map((image, i) => {
                  return (
                    <CarouselItem key={`${image.title}_${i}`}>
                      <Suspense fallback={<h2>loading...</h2>}>
                        <Image
                          width={500}
                          height={500}
                          className="w-full"
                          src={image?.disBaseLink || ""}
                          alt={image?.alt || ""}
                        />
                      </Suspense>
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

          {product.longDescription && (
            <div className="mt-10">
              <h2 className="text-sm font-medium text-foreground">Details</h2>

              <div className="mt-4 space-y-6 prose dark:prose-invert">
                <div
                  className="prose dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: product.longDescription }}
                />
              </div>
            </div>
          )}

          <div className="mt-10 space-y-3">
            {product.variationAttributes?.map((variationAttribute) => {
              if (variationAttribute.id === "color") {
                return (
                  <div key={variationAttribute.id} className="space-y-3">
                    <p className="capitalize">{variationAttribute.id}</p>
                    <ul className="flex gap-3">
                      {variationAttribute.values?.map(
                        ({ name, orderable, value }) => {
                          const sw = getVariantValueSwatch(product, value);

                          const selected = searchParams["color"] === value;

                          return (
                            <Link
                              key={value}
                              href={{
                                pathname: `/product/${product.id}`,
                                query: new URLSearchParams({
                                  ...product.variationValues,
                                  ...searchParams,
                                  [variationAttribute.id]: value,
                                }).toString(),
                              }}
                            >
                              <li>
                                <Suspense fallback={<h2>loading...</h2>}>
                                  <Image
                                    width={50}
                                    height={50}
                                    className={cn(
                                      "ring-2 aspect-square rounded-full w-10 cursor-pointer",
                                      !orderable && "ring-red-500",
                                      selected && "ring-yellow-500"
                                    )}
                                    src={sw?.disBaseLink}
                                    alt={sw?.alt}
                                  />
                                </Suspense>
                              </li>
                            </Link>
                          );
                        }
                      )}
                    </ul>
                  </div>
                );
              }

              return (
                <div key={variationAttribute.id} className="space-y-3">
                  <p className="capitalize">{variationAttribute.id}</p>
                  <ul className="flex gap-3">
                    {variationAttribute.values?.map(
                      ({ name, orderable, value }) => {
                        const selected =
                          //@ts-ignore
                          searchParams[variationAttribute.id] === value;

                        return (
                          <Link
                            key={value}
                            aria-disabled={!orderable}
                            href={{
                              pathname: `/product/${product.id}`,
                              query: new URLSearchParams({
                                ...product.variationValues,
                                ...searchParams,
                                [variationAttribute.id]: value,
                              }).toString(),
                            }}
                          >
                            <li
                              className={cn(
                                "ring-2 w-10 aspect-square text-center flex items-center justify-center cursor-pointer",
                                !orderable && "ring-red-400",
                                selected && "ring-yellow-500"
                              )}
                            >
                              {value}
                            </li>
                          </Link>
                        );
                      }
                    )}
                  </ul>
                </div>
              );
            })}

            {/* Button */}
            <CartAction disabled={!variant} product={variant} />

          </div>
        </div>
      </div>
    </div>
  );
}
