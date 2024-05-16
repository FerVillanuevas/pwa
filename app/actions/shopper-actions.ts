"use server";

import { loginFormData } from "@/components/commerce/login-dialog";

import {
  createClient,
  removeSessionCookie,
  getUSID,
  AuthTypes, handleToken
} from "@/lib/commerce-kit";

import { ShopperBasketsTypes, helpers } from "commerce-sdk-isomorphic";

export default async function loginAsB2C(formData: loginFormData) {
  const client = await createClient();

  const usid = await getUSID();

  try {
    const token = await helpers.loginRegisteredUserB2C(
      //@ts-ignore
      shopperLogin,
      {
        ...formData,
        clientSecret: process.env.CLIENT_SECRET,
      },
      {
        redirectURI: "http://localhost:3000/callback",
        //@ts-ignore
        usid: usid,
      }
    );

    await handleToken(token, AuthTypes.Creadentials);

    const customer = await client.shopperCustomers.getCustomer({
      parameters: {
        //@ts-ignore
        customerId: token.customer_id,
      },
    });

    return customer;
  } catch (error) {
    console.log(error);
  }
}

export async function getCustomer() {
  const client = await createClient();
  const usid = await getUSID();

  if(client.session?.type === AuthTypes.Creadentials) {
    try {
      let customer = await client.shopperCustomers.getCustomer({
        parameters: {
          //@ts-ignore
          customerId: usid?.customerId,
        },
      });
      return customer;
    } catch (error) {
      removeSessionCookie();
    }
  }


}

export async function setBasket() {
  const client = await createClient();
  const customer = await getUSID();

  let basket: ShopperBasketsTypes.Basket | null;

  const baskets = await client.shopperCustomers.getCustomerBaskets({
    parameters: {
      //@ts-ignore
      customerId: customer?.customerId,
    },
  });

  if (baskets.total === 0) {
    basket = await client.shopperBaskets.createBasket({
      body: {
        customerInfo: {
          email: "",
          //@ts-ignore
          customerId: customer?.customerId,
        },
      },
    });
  } else {
    basket = baskets.baskets?.[0] || null;
  }

  return basket;
}

