'use client';

import { store$ } from "@/lib/state/store";
import currency from "currency.js";

export default function BasketSummary() {
  const basket = store$.basket.get();

  return (
    <div className="py-4 space-y-4 text-sm font-medium">
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
        {currency(basket?.orderTotal || basket?.productTotal || 0).format()}
      </div>
    </div>
  );
}
