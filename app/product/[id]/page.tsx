import SubmitButton from "@/components/commerce/SubmitButton";
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
import { Checkout, Customer, Product } from "commerce-sdk";
import { ShopperProducts } from "commerce-sdk/dist/product/product";
import { revalidateTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

/* This is a server action! */
const addToCart = async (
  basket: Checkout.ShopperBaskets.Basket | null,
  product: { productId: string; price: number }
) => {
  if (!basket) return;

  const token = await getSession();

  const shopperBaskets = new Checkout.ShopperBaskets({
    ...config,
    headers: {
      authorization: `Bearer ${token?.access_token}`,
    },
  });

  await shopperBaskets.addItemToBasket({
    parameters: {
      //@ts-ignore
      basketId: basket.basketId,
    },
    body: [
      {
        productId: product.productId,
        price: product.price,
        quantity: 1,
      },
    ],
  });

  /* This will revalidate the getBasket call, so it will update the cart Icon by consequence */
  revalidateTag("basket");
};

interface IParams {
  params: { id: string };
  searchParams: { pid?: string; color?: string };
}

export default async function Page({ params, searchParams }: IParams) {
  return (
    <div className="bg-background py-6">
      <Suspense fallback={<p>loading...</p>}>
        <ProductView params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ProductView({ params, searchParams }: IParams) {
  const { pid, color } = searchParams;

  const token = await getSession();
  let basket: Checkout.ShopperBaskets.Basket | null;

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
    <div className="grid grid-cols-3 container gap-4">
      <div className="col-span-2">
        <div className="container w-full justify-center flex px-20">
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

        <div className="mt-10">
          <h2 className="text-sm font-medium text-foreground">Details</h2>

          <div className="mt-4 space-y-6 prose dark:prose-invert">
            {product.longDescription}
          </div>
        </div>

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
                      //@ts-ignore
                      const selected =
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

          <Suspense fallback={<p>Loading...</p>}>
            <AddTobasket variant={variant}/>
          </Suspense>

        </div>
      </div>
    </div>
  );
}

async function AddTobasket({variant}: {variant?: ShopperProducts.Variant}) {
	const token = await getSession();
	let basket: Checkout.ShopperBaskets.Basket | null;

	const shopperBaskets = new Checkout.ShopperBaskets({
		...config,
		headers: {
			authorization: `Bearer ${token?.access_token}`,
		},
	});

  const shopperCustomers = new Customer.ShopperCustomers({
		...config,
		headers: {
			authorization: `Bearer ${token?.access_token}`,
		},
	});

  const baskets = await shopperCustomers.getCustomerBaskets({
		parameters: {
			//@ts-ignore
			customerId: token?.customer_id,
		},
	});

	if (baskets.total === 0) {
		basket = await shopperBaskets.createBasket({
			body: {
				customerInfo: {
					email: "",
					//@ts-ignore
					customerId: token?.customer_id,
				},
			},
		});
	} else {
		basket = baskets.baskets?.[0] || null;
	}

  return (
    <form
      className="mt-10"
      action={async () => {
        "use server";
        variant &&
          (await addToCart(basket, {
            productId: variant?.productId,
            price: variant?.price || 0,
          }));
      }}
    >
      <SubmitButton toastText="Added to cart">Add to bag</SubmitButton>
    </form>
  );
}
