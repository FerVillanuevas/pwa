"use client";

import Contact from "./components/contact";
import ShippingAddress from "./components/ShippingAddress";
import ShippingMethods from "./components/ShippingMethods";
import Payment from "./components/payment";
import { StepTypes, checkout$ } from "@/lib/state/checkout";
import dynamic from "next/dynamic";

const BasketSummary = dynamic(() => import("@/components/commerce/basket-summary"), {
  loading: () => <p>loading...</p>,
});


export default function CheckoutPage() {
  const step = checkout$.get();

  return (
    <div className="container grid grid-cols-3 gap-12">
      <div className="col-span-2 w-2/3 space-y-6 py-6">
        <Contact step={step[StepTypes.CONTACT]} />
        <ShippingAddress step={step[StepTypes.SHIPPING_ADDRESS]} />
        <ShippingMethods step={step[StepTypes.SHIPPING_METHODS]} />
        <Payment step={step[StepTypes.PAYMENT]} />
      </div>
      <div className="col-span-1">{/* Summary */}
        <BasketSummary />
      </div>
    </div>
  );
}
