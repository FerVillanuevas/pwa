import { ViewTypes } from "@/enums/product";
import { getSession } from "@/lib/commerce";
import { shopperCustomers, shopperProducts } from "@/lib/global";
import { getImageByViewType } from "@/lib/utils/commerce";
import { Checkout, Product } from "commerce-sdk";
import Image from "next/image";
import { Suspense } from "react";

import Link from "@/components/commerce/Link";
import dynamic from "next/dynamic";
const BasketSummary = dynamic(
  () => import("@/components/commerce/basket-summary"),
  {
    loading: () => <p>loading...</p>,
  }
);

export default async function Page() {
  const session = await getSession();

  if (!session) return <p>error...</p>;

  const baskets = await shopperCustomers.getCustomerBaskets({
    parameters: {
      //@ts-ignore
      customerId: session.customer_id,
    },
    headers: {
      authorization: `Bearer ${session.access_token}`,
    },
  });

  const basket = baskets?.baskets?.[0];

  if (!basket) return <p>Empty...</p>;

  return (
    <div className="container">
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-4">
          <Suspense fallback={<p>loading...</p>}>
            <FullProducts basket={basket} />
          </Suspense>
        </div>
        <div className="col-span-2 ">
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
  const session = await getSession();
  if (!basket.productItems || !session) return <p>empty...</p>;

  const products = await shopperProducts.getProducts({
    parameters: {
      ids: basket.productItems.map(({ productId }) => productId).join(","),
      allImages: true,
    },
    headers: {
      authorization: `Bearer ${session.access_token}`,
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
