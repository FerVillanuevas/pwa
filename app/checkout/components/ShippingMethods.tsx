"use client";

import StepCard from "./StepCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StepStatus, StepTypes, setStep } from "@/lib/state/checkout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getShippingMethods, updateShippingMethod } from "../actions";
import { store$ } from "@/lib/state/store";
import currency from "currency.js";

export default function ShippingMethods({ step }: { step: StepStatus }) {
  const basket = store$.basket.get();

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["shippingMethods"],
    queryFn: async () => {
      const response = await getShippingMethods({
        basketId: basket.basketId!,
      });
      return response;
    },
    enabled: step === StepStatus.CURRENT,
  });

  const { mutate } = useMutation({
    mutationFn: async (id: string) => {
      updateShippingMethod({
        basketId: basket.basketId!,
        shippingMethodId: id,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["basket"],
      });
      setStep(StepTypes.PAYMENT);
    },
    onError: (e) => {
      console.log(e);
    },
  });

  if (step !== StepStatus.CURRENT) return <StepCard title="Shipping methods" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping methods</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data?.applicableShippingMethods?.map((shippingMethod) => {
          return (
            <Card
              key={shippingMethod.id}
              onClick={() => mutate(shippingMethod.id)}
            >
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle>{shippingMethod.name}</CardTitle>
                  <CardTitle>
                    {currency(shippingMethod.price || 0).format()}
                  </CardTitle>
                </div>
                <CardDescription>{shippingMethod.description}</CardDescription>
              </CardHeader>
              {shippingMethod.shippingPromotions && (
                <CardContent>
                  <ul>
                    {shippingMethod.shippingPromotions.map((promotion) => {
                      return (
                        <p key={promotion.promotionId}>
                          {promotion.calloutMsg} 
                        </p>
                      );
                    })}
                  </ul>
                </CardContent>
              )}
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}
