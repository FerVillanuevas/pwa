"use server";

import checkoutApi from "@/lib/adyen";
import { Types } from "@adyen/api-library";
import { v4 } from "uuid";
import axios from "axios";
import { createClient } from "@/lib/commerce-kit";

const PAYMENT_METHODS = {
  ADYEN_COMPONENT: "AdyenComponent",
  CREDIT_CARD: "CREDIT_CARD",
};

const PAYMENT_METHOD_TYPES = {
  GIFT_CARD: "giftcard",
  WECHATPAY_MINI_PROGRAM: "wechatpayMiniProgram",
  WECHATPAY_QR: "wechatpayQR",
  WECHATPAY_SDK: "wechatpaySDK",
};

const BLOCKED_PAYMENT_METHODS = [
  PAYMENT_METHOD_TYPES.GIFT_CARD,
  PAYMENT_METHOD_TYPES.WECHATPAY_MINI_PROGRAM,
  PAYMENT_METHOD_TYPES.WECHATPAY_QR,
  PAYMENT_METHOD_TYPES.WECHATPAY_SDK,
];

export async function getPaymentsReponse(
  total: number,
  shopperLocale: string,
  countryCode: string,
  currency: string
) {
  const paymentMethodsRequest = {
    blockedPaymentMethods: BLOCKED_PAYMENT_METHODS,
    shopperLocale,
    countryCode,
    merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT,
    amount: {
      value: total,
      currency,
    },
  };

  const response: Types.checkout.PaymentMethodsResponse =
    await checkoutApi.PaymentsApi.paymentMethods(paymentMethodsRequest, {
      idempotencyKey: v4(),
    });

  return JSON.parse(JSON.stringify(response));
}

export async function sumbitPayment({
  payment,
  basketId,
  customerId,
}: {
  payment: any;
  basketId: string;
  customerId: string;
}) {
  try {
    const client = await createClient();

    const basket = await client.shopperBaskets.getBasket({
      parameters: {
        basketId,
      },
    });

    await client.shopperBaskets.addPaymentInstrumentToBasket({
      body: {
        amount: basket.orderTotal,
        paymentMethodId: PAYMENT_METHODS.ADYEN_COMPONENT,
        paymentCard: {
          cardType: payment.type,
        },
      },
      parameters: {
        basketId: basket.basketId!,
      },
    });

    const order = await client.shopperOrders.createOrder({
      body: {
        basketId: basket.basketId,
      },
    });

    const paymentRequest: any = {
      ...payment,
      reference: order.orderNo,
      amount: {
        value: order.orderTotal,
        currency: order.currency,
      },
      authenticationData: {
        threeDSRequestData: {
          nativeThreeDS: "preferred",
        },
      },
      channel: "Web",
      returnUrl: `${payment.origin}/checkout/redirect`,
      shopperReference: order?.customerInfo?.customerId,
      shopperEmail: order?.customerInfo?.email,
      shopperName: order.customerInfo?.customerName,
    };

    const { data } = await axios.post(
      "https://checkout-test.adyen.com/v70/payments",
      {
        ...paymentRequest,
        merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT,
      },
      {
        headers: {
          customerid: customerId,
          basketid: basketId,
          "x-api-key": process.env.ADYEN_API_KEY,
        },
      }
    );

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function submitAditionalDetails({
  body,
  customerId,
}: {
  body: any;
  customerId: string;
}) {
  const { data } = await axios.post(
    "https://checkout-test.adyen.com/v70/payments",
    {
      ...body,
      merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT,
    },
    {
      headers: {
        customerid: customerId,
        "x-api-key": process.env.ADYEN_API_KEY,
      },
    }
  );

  return data;
}

export async function continueAsGuest({ basketId, email }: any) {
  const client = await createClient();

  const response = await client.shopperBaskets.updateCustomerForBasket({
    parameters: {
      basketId,
    },
    body: {
      email,
    },
  });

  return response;
}

export async function updateShippingAddresss({
  basketId,
  shipping,
}: {
  basketId: string;
  shipping: any;
}) {
  const client = await createClient();

  await client.shopperBaskets.updateShippingAddressForShipment({
    parameters: {
      basketId: basketId,
      shipmentId: "me",
      useAsBilling: true,
    },
    body: shipping,
  });
}

export async function getShippingMethods({
  basketId,
  shipmentId = "me",
}: {
  basketId: string;
  shipmentId?: string;
}) {
  const client = await createClient();

  const response = await client.shopperBaskets.getShippingMethodsForShipment({
    parameters: {
      basketId,
      shipmentId,
    }
  });

  return response;
}

export async function updateShippingMethod({
  basketId,
  shipmentId = "me",
  shippingMethodId,
}: {
  basketId: string;
  shipmentId?: string;
  shippingMethodId: string;
}) {
  const client = await createClient();

  const response = await client.shopperBaskets.updateShippingMethodForShipment({
    parameters: {
      basketId,
      shipmentId,
    },
    body: {
      id: shippingMethodId,
    }
  });

  return response;
}
