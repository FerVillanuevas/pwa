"use client";

import Link from "./Link";
import { ShoppingBasketIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { store$ } from "@/lib/state/store";

export default function Cart() {
  const basket = store$.basket.get();

  return (
    <div className="relative">
      <Link
        href="/cart"
        variant="outline"
        size="icon"
        className="justify-center aspect-square"
      >
        <ShoppingBasketIcon className="h-[1.2rem] w-[1.2rem]" />
        {basket?.productItems?.length && (
          <Badge variant="destructive" className="px-1 py-0.5 absolute -top-1 -right-1.5">
            {basket?.productItems.length}
          </Badge>
        )}
      </Link>
    </div>
  );
}
