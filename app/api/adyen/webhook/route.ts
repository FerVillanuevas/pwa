import { config } from "@/lib/commerce";
import { hmacValidator } from "@adyen/api-library";
import { Checkout } from "commerce-sdk";
import { NextRequest, NextResponse } from "next/server";

const ORDER = {
  ORDER_STATUS_CREATED: "created",
  ORDER_STATUS_NEW: "new",
  ORDER_STATUS_COMPLETED: "completed",
  ORDER_STATUS_CANCELED: "cancelled",
  ORDER_STATUS_FAILED: "failed",
  PAYMENT_STATUS_PAID: "paid",
  PAYMENT_STATUS_PART_PAID: "part_paid",
  PAYMENT_STATUS_NOT_PAID: "not_paid",
  EXPORT_STATUS_READY: "ready",
  EXPORT_STATUS_FAILED: "failed",
  EXPORT_STATUS_EXPORTED: "exported",
  EXPORT_STATUS_NOT_EXPORTED: "not_exported",
  CONFIRMATION_STATUS_CONFIRMED: "confirmed",
  CONFIRMATION_STATUS_NOT_CONFIRMED: "not_confirmed",
};

export const POST = async (req: NextRequest) => {
  const { notificationItems } = await req.json();

  const { NotificationRequestItem } = notificationItems[0];

  const HmacValidator = new hmacValidator();

  if (
    !HmacValidator.validateHMAC(
      NotificationRequestItem,
      process.env.ADYEN_HMAC_KEY!
    )
  ) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 404 }
    );
  }

  const base64data = Buffer.from(
    `${process.env.SFCC_CLIENT_ID}:${process.env.SFCC_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(
    "https://account.demandware.com/dwsso/oauth2/access_token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${base64data}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        scope: `SALESFORCE_COMMERCE_API:zybl_003 sfcc.orders.rw`,
      }),
    }
  );

  const json = await res.json();

  const orderNo = NotificationRequestItem.merchantReference;

  const orders = new Checkout.Orders({
    ...config,
    headers: {
      Authorization: `Bearer ${json.access_token}`,
    },
  });

  if (NotificationRequestItem.success !== "true") {
    await orders.updateOrderConfirmationStatus({
      parameters: { orderNo },
      body: {
        status: ORDER.CONFIRMATION_STATUS_NOT_CONFIRMED,
      },
    });
    await orders.updateOrderPaymentStatus({
      parameters: { orderNo },
      body: {
        status: ORDER.PAYMENT_STATUS_NOT_PAID,
      },
    });
    await orders.updateOrderExportStatus({
      parameters: { orderNo },
      body: {
        status: ORDER.EXPORT_STATUS_NOT_EXPORTED,
      },
    });
    await orders.updateOrderStatus({
      parameters: { orderNo },
      body: {
        status: ORDER.ORDER_STATUS_FAILED,
      },
    });

    return NextResponse.json({}, { status: 200 });
  }

  await orders.updateOrderConfirmationStatus({
    parameters: {
      orderNo,
    },
    body: {
      status: ORDER.CONFIRMATION_STATUS_CONFIRMED,
    },
  });

  await orders.updateOrderPaymentStatus({
    parameters: {
      orderNo,
    },
    body: {
      status: ORDER.PAYMENT_STATUS_PAID,
    },
  });

  await orders.updateOrderExportStatus({
    parameters: {
      orderNo,
    },
    body: {
      status: ORDER.EXPORT_STATUS_READY,
    },
  });

  await orders.updateOrderStatus({
    parameters: {
      orderNo,
    },
    body: {
      status: ORDER.ORDER_STATUS_NEW,
    },
  });

  return NextResponse.json({}, { status: 200 });
};
