"use client";

import AdyenCheckoutPrimitive from "@adyen/adyen-web";
import "@adyen/adyen-web/dist/adyen.css";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { submitAditionalDetails, sumbitPayment } from "../actions";
import { store$ } from "@/lib/state/store";
import { useRouter } from "next/navigation";

export default function AdyenCheckout({ methods }: { methods: JSON }) {
  const basket = store$.basket.get();

  const router = useRouter();

  const dropInRef = useRef<HTMLDivElement>();

  const { mutate } = useMutation({
    mutationFn: async (state: any) => {
      const data = await sumbitPayment({
        payment: {
          ...state.data,
          origin: state.data.origin
            ? state.data.origin
            : window.location.origin,
        },
        customerId: basket.customerInfo?.customerId!,
        basketId: basket.basketId!,
      });
      return data;
    },
    onSuccess: async (responses) => {
      router.replace(`/checkout/confirmation/${responses?.merchantReference}`);
    },
  });

  const { mutate: onAdditionalDetails } = useMutation({
    mutationFn: async (state: any) => {
      const data = await submitAditionalDetails({
        body: state.data,
        customerId: basket.customerInfo?.customerId!,
      });
      return data;
    },
    onSuccess: (res) => {
      console.log(res);
    },
  });

  const configuration = {
    paymentMethodsResponse: methods, // The `/paymentMethods` response from the server.
    clientKey: "test_NX3SKJ7D7ZBWRPAPOQBWSWO6UIE5WCCA", // Web Drop-in versions before 3.10.1 use originKey instead of clientKey.
    locale: "en-US",
    environment: "test",
    analytics: {
      enabled: true, // Set to false to not send analytics data to Adyen.
    },
    onSubmit: (state: any) => {
      mutate(state);
    },
    onAdditionalDetails: (state: any) => {
      onAdditionalDetails(state);
    },
    onChange: (state: any) => {
      if (state.isValid) {
        console.log(state.data);
      }
    },
    paymentMethodsConfiguration: {
      card: {
        // Example optional configuration for Cards
        hasHolderName: true,
        holderNameRequired: true,
        enableStoreDetails: true,
        hideCVC: false, // Change this to true to hide the CVC field for stored cards
        name: "Credit or debit card",
      },
    },
  };

  useEffect(() => {
    const createCheckout = async () => {
      //@ts-ignore
      const checkout = await AdyenCheckoutPrimitive(configuration);

      checkout
        .create("dropin", {
          openFirstPaymentMethod: true,
        })
        .mount(dropInRef.current!);
    };
    dropInRef.current && createCheckout();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //@ts-ignore
  return <div ref={dropInRef}></div>;
}
