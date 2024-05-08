"use client";

import { StepStatus } from "@/lib/state/checkout";
import StepCard from "./StepCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getPaymentsReponse } from "../actions";
import { store$ } from "@/lib/state/store";
import AdyenCheckout from "./adyenCheckout";
import currency from "currency.js";

export default function Payment({ step }: { step: StepStatus }) {
  const basket = store$.basket.get();

  const { data, isLoading } = useQuery({
    queryKey: ["checkout"],
    queryFn: async () => {
      const response = await getPaymentsReponse(
        basket.orderTotal || basket.productTotal || 0,
        "en-US",
        "US",
        "usd"
      );
      return response;
    },
    enabled: step === StepStatus.CURRENT,
  });

  if (step !== StepStatus.CURRENT) return <StepCard title="Payment info" />;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Payment info</CardTitle>
        <CardTitle>
          {currency(basket.orderTotal || basket.productTotal || 0).format()}
        </CardTitle>
      </CardHeader>
      <CardContent>{data && <AdyenCheckout methods={data} />}</CardContent>
    </Card>
  );
}
