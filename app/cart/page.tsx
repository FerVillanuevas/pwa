import { ViewTypes } from "@/enums/product";
import { getSession } from "@/lib/commerce";
import composable from "@/lib/global";
import { getImageByViewType } from "@/lib/utils/commerce";
import { Checkout, Product } from "commerce-sdk";
import currency from "currency.js";
import Image from "next/image";
import { Suspense } from "react";

export default async function Page() {
  const session = await getSession();

  if (!session) return <p>error...</p>;

  const { shopperCustomers } = composable;

  const baskets = await shopperCustomers.getCustomerBaskets({
    parameters: {
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
        <div className="col-span-2 py-4 space-y-4 text-sm font-medium">
          <h1 className="text-xl font-bold">Summary</h1>
          <div className="flex justify-between">
            <b>Subtotal:</b> {currency(basket?.productSubTotal || 0).format()}
          </div>
          <div className="flex justify-between">
            <b>Shipping:</b> {currency(basket?.shippingTotal || 0).format()}
          </div>
          <div className="flex justify-between">
            <b>tax:</b> {currency(basket?.taxTotal || 0).format()}
          </div>
          <div className="flex justify-between">
            <b>Estimated Total:</b>
            {currency(basket?.productTotal || 0).format()}
          </div>
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

  const { shopperProducts } = composable;

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

function ProductItem({ product }: { product: Product.ShopperProducts.Product }) {
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
