"use server";

import { loginFormData } from "@/components/commerce/login-dialog";
import {
  AuthTypes,
  applySetCookie,
  encrypt,
  getSession,
  handleToken,
  storeToken,
} from "@/lib/commerce";
import { shopperCustomers, shopperLogin } from "@/lib/global";
import { helpers } from "commerce-sdk-isomorphic";
import { cookies } from "next/headers";

type Helpers = typeof helpers;

helpers["loginRegisteredUserB2C"];

export default async function loginAsB2C(formData: loginFormData) {
  const session = await getSession();

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
        usid: session?.usid,
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
