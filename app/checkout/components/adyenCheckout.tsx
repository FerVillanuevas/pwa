"use client";

import AdyenCheckoutPrimitive from "@adyen/adyen-web";
import "@adyen/adyen-web/dist/adyen.css";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { sumbitPayment } from "../actions";
import { store$ } from "@/lib/state/store";

const onAdditionalDetails = async (state, component, props) => {
  /* const adyenPaymentsDetailsService = new AdyenPaymentsDetailsService(props?.token, props?.site)
  const paymentsDetailsResponse = await adyenPaymentsDetailsService.submitPaymentsDetails(
      state.data,
      props?.customerId
  )
  return {paymentsDetailsResponse: paymentsDetailsResponse} */
  return {};
};

export default function AdyenCheckout({ methods }: { methods: JSON }) {
  const basket = store$.basket.get();

  const dropInRef = useRef<HTMLDivElement>();

  const { mutate } = useMutation({
    mutationFn: async (state) => {
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
    onSubmit: (state) => {
      mutate(state);
    },
    onAdditionalDetails: onAdditionalDetails,
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
  }, []);

  //@ts-ignore
  return <div ref={dropInRef}></div>;
}
