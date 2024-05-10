"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import StepCard from "./StepCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StepStatus, StepTypes, setStep } from "@/lib/state/checkout";
import { useMutation } from "@tanstack/react-query";
import { updateShippingAddresss } from "../actions";
import { store$ } from "@/lib/state/store";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType, object, string } from "yup";

const shippingAddressSchema = object({
  address1: string().required(),
  firstName: string().required(),
  lastName: string().required(),
  phone: string().required(),
  city: string().required(),
  postalCode: string().required(),
  countryCode: string().required(),
  stateCode: string().required(),
});

type shippingAddressData = InferType<typeof shippingAddressSchema>;

const resolver = yupResolver(shippingAddressSchema);

export default function ShippingAddress({ step }: { step: StepStatus }) {
  const basket = store$.basket.get();

  const form = useForm({
    resolver,
  });

  const { mutate } = useMutation({
    mutationFn: async (formData: shippingAddressData) => {
      const response = await updateShippingAddresss({
        basketId: basket.basketId!,
        shipping: formData,
      });
      return response;
    },
    onSuccess: () => {
      setStep(StepTypes.SHIPPING_METHODS);
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const handleFormSubmit = (formData: shippingAddressData) => {
    console.log("submit", formData);
    mutate(formData);
  };

  if (step !== StepStatus.CURRENT) return <StepCard title="Shipping address" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Address</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                name="firstName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="lastName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="address1"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                name="city"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="postalCode"
                control={form.control}
                render={({ field }) => (
                  <FormItem {...field}>
                    <FormLabel>Zip code</FormLabel>
                    <FormControl>
                      <Input placeholder="Zip Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                name="countryCode"
                control={form.control}
                render={({ field }) => (
                  <FormItem {...field}>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Country</SelectLabel>
                            <SelectItem value="US">United States</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="stateCode"
                control={form.control}
                render={({ field }) => (
                  <FormItem {...field}>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>State</SelectLabel>
                            <SelectItem value="AL">Alabama</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Save</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
