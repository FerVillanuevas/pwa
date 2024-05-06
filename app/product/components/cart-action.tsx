"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { store$ } from "@/lib/state/store";
import AddToBasketAction from "../actions/add-to-basket";
import { ShopperProducts } from "commerce-sdk/dist/product/product";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

interface ICartActionProps extends ButtonProps {
  product?: ShopperProducts.Variant;
}

export default function CartAction({
  product,
  disabled,
  ...props
}: ICartActionProps) {
  const basket = store$.basket.get();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const newBasket = await AddToBasketAction(basket.basketId!, product);
      return newBasket;
    },
    onSuccess: () => {
      toast.success("Producct added", {
        action: {
          label: "Action",
          onClick: () => console.log("Action!"),
        },
      });
    },
  });

  return (
    <div>
      <Button
        {...props}
        disabled={disabled || isPending}
        onClick={() => {
          mutate();
        }}
      >
        {isPending && <Loader2Icon className="animate-spin" />} Add to cart
      </Button>
    </div>
  );
}
