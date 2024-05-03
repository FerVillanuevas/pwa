"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { store$ } from "@/lib/state/store";
import AddToBasketAction from "../actions/add-to-basket";
import { ShopperProducts } from "commerce-sdk/dist/product/product";

interface ICartActionProps extends ButtonProps {
  product?: ShopperProducts.Variant;
}

export default function CartAction({ product, ...props }: ICartActionProps) {
  const basket = store$.basket.get();
  return (
    <div>
      <Button {...props} onClick={async () => {
        await AddToBasketAction(basket.basketId, product);
      }}>Add to cart</Button>
    </div>
  );
}
