"use server";

import { loginFormData } from "@/components/commerce/login-dialog";
import {
  AuthTypes,
  getSession,
  getUSID,
  handleToken,
  removeSessionCookie,
} from "@/lib/commerce";
import { shopperCustomers, shopperLogin } from "@/lib/global";
import { helpers } from "commerce-sdk-isomorphic";

export default async function loginAsB2C(formData: loginFormData) {
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
        usid: usid,
      }
    );

    await handleToken(token, AuthTypes.Creadentials);

    const customer = await shopperCustomers.getCustomer({
      parameters: {
        //@ts-ignore
        customerId: token.customer_id,
      },
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
      },
    });

    return customer;
  } catch (error) {
    console.log(error);
  }
}

export async function getCustomer() {
  const session = await getSession();

  try {
    let customer = await shopperCustomers.getCustomer({
      parameters: {
        //@ts-ignore
        customerId: session.customer_id,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    return customer;
  } catch (error) {
    removeSessionCookie();
  }
}
