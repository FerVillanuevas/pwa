import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ViewTypes } from "@/enums/product";
import { cn } from "@/lib/utils";
import { getVariantValueSwatch } from "@/lib/utils/commerce";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import CartAction from "../components/cart-action";
import { createClient } from "@/lib/commerce-kit";

interface IParams {
  params: { id: string };
  searchParams: { pid?: string; color?: string };
}

export default async function ProductView({ params, searchParams }: IParams) {
  const { pid, color } = searchParams;

  const client = await createClient();

  const product = await client.shopperProducts.getProduct({
    parameters: { id: pid || params.id, allImages: true },
    //@ts-ignore
    next: { tags: ["product", pid] }
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
    <div className="md:container space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="w-full justify-center flex sticky top-20">
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
              <div className="absolute bottom-0 right-5 flex gap-4">
                <CarouselPrevious className="relative left-auto" />
                <CarouselNext className="relative right-auto" />
              </div>
            </Carousel>
          </div>
        </div>

        <div className="container md:col-span-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {product.name}
          </h1>

          <h2 className="sr-only">Product information</h2>
          <p className="text-3xl tracking-tight text-foreground mt-4">
            ${product.price}
          </p>

          <div className="mt-10 space-y-3">
            {product.variationAttributes?.map((variationAttribute) => {
              if (variationAttribute.id === "color") {
                return (
                  <div key={variationAttribute.id} className="space-y-3">
                    <p className="capitalize">{variationAttribute.id}</p>
                    <ul className="flex gap-3 flex-wrap">
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
                  <ul className="flex gap-3 flex-wrap justify-between">
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
        </div>
      </div>
    </div>
  );
}
