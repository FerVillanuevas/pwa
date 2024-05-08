"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { continueAsGuest } from "../actions";
import { store$ } from "@/lib/state/store";

import { yupResolver } from "@hookform/resolvers/yup";
import { InferType, object, string } from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StepCard from "./StepCard";
import { StepStatus, StepTypes, setStep } from "@/lib/state/checkout";

const guestFormSchema = object({
  email: string().email().required(),
  basketId: string().required(),
});

export type guestFormData = InferType<typeof guestFormSchema>;

const resolver = yupResolver(guestFormSchema);

export default function Contact({ step }: { step: StepStatus }) {
  const basket = store$.basket.get();

  const queryClient = useQueryClient();

  const defaultInfo = basket?.customerInfo?.email
    ? {
        email: basket?.customerInfo?.email,
        basketId: basket?.basketId!,
      }
    : {
        basketId: basket?.basketId!,
      };

  const { handleSubmit, register } = useForm({
    defaultValues: defaultInfo,
    resolver,
  });

  const { mutate, data } = useMutation({
    mutationKey: ["basket"],
    mutationFn: async (formData: guestFormData) => {
      const data = await continueAsGuest(formData);
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["basket"],
      });
      setStep(StepTypes.SHIPPING_ADDRESS);
    },
  });

  const handleFormSubmit = (data: guestFormData) => {
    mutate(data);
  };

  if (step !== StepStatus.CURRENT) return <StepCard title="Contact info" />;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4">
      <h1>Continue as guest</h1>
      <Input {...register("email")} placeholder="email" />
      <Button type="submit">Continue as guest</Button>
    </form>
  );
}
