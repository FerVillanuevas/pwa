import { ViewTypes } from "@/enums/product";
import { getImageByViewType } from "@/lib/utils/commerce";
import { Checkout, Product } from "commerce-sdk";
import Image from "next/image";
import { Suspense } from "react";

import Link from "@/components/commerce/Link";
import dynamic from "next/dynamic";
import { createClient, getCustomerId } from "@/lib/commerce-kit";
const BasketSummary = dynamic(
  () => import("@/components/commerce/basket-summary"),
  {
    loading: () => <p>loading...</p>,
  }
);

export default async function Page() {
  const client = await createClient();
  const customerId = await getCustomerId();

  const baskets = await client.shopperCustomers.getCustomerBaskets({
    parameters: {
      //@ts-ignore
      customerId: customerId,
    },
  });

  const basket = baskets?.baskets?.[0];

  if (!basket) return <p>Empty...</p>;

  return (
    <div className="container py-6 md:py-4">
      <div className="grid md:grid-cols-6 gap-4">
        <div className="md:col-span-4">
          <Suspense fallback={<p>loading...</p>}>
            <FullProducts basket={basket} />
          </Suspense>
        </div>
        <div className="md:col-span-2">
          <BasketSummary />
          <Link href={"/checkout"} variant="default">
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

async function FullProducts({
  basket,
}: {
  basket: Checkout.ShopperBaskets.Basket;
}) {
  const client = await createClient();
  if (!basket.productItems) return <p>empty...</p>;

  const products = await client.shopperProducts.getProducts({
    parameters: {
      ids: basket.productItems.map(({ productId }) => productId).join(","),
      allImages: true,
    },
  });

  return (
    <ul className="divide-y py-4">
      {basket.productItems.map((productItem) => {
        const product = products.data.find(
          ({ id }) => id === productItem.productId
        );

        return (
          <li key={productItem.productId}>
            {product && <ProductItem product={product} />}
            {productItem.productName}
          </li>
        );
      })}
    </ul>
  );
}

function ProductItem({
  product,
}: {
  product: Product.ShopperProducts.Product;
}) {
  const imageGroup = getImageByViewType(product.imageGroups!, ViewTypes.LARGE);

  return (
    <>
      {imageGroup?.images && (
        <Image
          src={imageGroup?.images[0].disBaseLink || ""}
          alt={imageGroup?.images[0].alt || ""}
          width={100}
          height={100}
        />
      )}
    </>
  );
}
