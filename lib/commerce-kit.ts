import "server-only";

import { kv } from "@vercel/kv";

import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

import {
  ShopperBaskets,
  ShopperContexts,
  ShopperCustomers,
  ShopperExperience,
  ShopperGiftCertificates,
  ShopperOrders,
  ShopperProducts,
  ShopperPromotions,
  ShopperSearch,
  ShopperSeo,
  ShopperLogin,
  ClientConfigInit,
  ShopperLoginTypes,
} from "commerce-sdk-isomorphic";
import { NextResponse } from "next/server";
import { TokenResponse } from "commerce-sdk/dist/helpers/slasClient";

export type TSessionToken = {
  access_token: string;
  customer_id: string;
  type: AuthTypes;
  iat: number;
  exp: number;
};

export type TRefreshToken = {
  refresh_token: string;
  type: AuthTypes;
  iat: number;
  exp: number;
};

export enum AuthTypes {
  Guest,
  Creadentials,
}

export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const ORG_ID = process.env.ORG_ID;
export const SHORT_CODE = process.env.SHORT_CODE;
export const SITE_ID = process.env.SITE_ID;

export const SESSION_KEY = "cnx-session";
export const REFRESH_TOKEN_KEY = "cnx-refresh";
export const USID_KEY = "cnx-usid";
export const CUSTOMER_KEY = "cnx-customer";

const key = new TextEncoder().encode(process.env.SECRET_KEY);

export const handleToken = async (
  token: ShopperLoginTypes.TokenResponse,
  type?: AuthTypes
) => {
  const exp = Date.now() + 1800 * 1000;
  const expRefresh = Date.now() + 2592000 * 1000;

  await kv.set(
    SESSION_KEY,
    {
      access_token: token.access_token,
      type: type || AuthTypes.Guest,
    },
    { ex: exp }
  );
  await kv.set(
    CUSTOMER_KEY,
    {
      customerId: token.customer_id,
      usid: token.usid,
    },
    { ex: expRefresh }
  );

  await kv.set(
    REFRESH_TOKEN_KEY,
    {
      refresh_token: token.refresh_token,
      exp: 2592000,
      type: type || AuthTypes.Guest,
    },
    { ex: expRefresh }
  );
};

export async function getUSID(): Promise<{
  usid: string;
  customerId: string;
} | null> {
  const usid = await kv.get<{ usid: string; customerId: string }>(CUSTOMER_KEY);
  if (!usid) return null;
  return usid;
}

export async function getCustomerId(): Promise<string | null> {
  const usid = cookies().get(CUSTOMER_KEY)?.value;
  if (!usid) return null;
  return usid;
}

export async function encrypt(
  payload: JWTPayload | undefined,
  expires: string | number | Date
) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(key);
}

export async function decrypt<T>(input: string): Promise<T> {
  const { payload } = await jwtVerify<T>(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export const removeSessionCookie = async () => {
  await kv.del(REFRESH_TOKEN_KEY, SESSION_KEY);
};

export async function getToken() {
  const refreshToken = cookies().get(REFRESH_TOKEN_KEY)?.value;

  const base64data = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
    "base64"
  );

  if (refreshToken) {
    try {
      const decryptToken = await decrypt<TRefreshToken>(refreshToken);

      const res = await fetch(
        `https://${SHORT_CODE}.api.commercecloud.salesforce.com/shopper/auth/v1/organizations/${ORG_ID}/oauth2/token`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${base64data}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          //@ts-ignore
          body: new URLSearchParams({
            refresh_token: decryptToken.refresh_token,
            grant_type: "refresh_token",
          }),
        }
      );

      const token = await res.json();

      await handleToken(token);

      return token;
    } catch (error) {
      removeSessionCookie();
    }
  }

  const res = await fetch(
    `https://${SHORT_CODE}.api.commercecloud.salesforce.com/shopper/auth/v1/organizations/${ORG_ID}/oauth2/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${base64data}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "client_credentials" }),
    }
  );

  const token = await res.json();

  await handleToken(token);

  return token;
}

export async function getSession() {
  const session = await kv.get(SESSION_KEY);
  if (session) session;
  const token = await getToken();
  return token;
}

export async function createClient() {
  const session = await getSession();

  const config: any = {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    parameters: {
      clientId: CLIENT_ID,
      organizationId: ORG_ID,
      shortCode: SHORT_CODE,
      siteId: SITE_ID,
    },
    throwOnBadResponse: true,
  };

  return {
    shopperBaskets: new ShopperBaskets(config),
    shopperContexts: new ShopperContexts(config),
    shopperCustomers: new ShopperCustomers(config),
    shopperExperience: new ShopperExperience(config),
    shopperGiftCertificates: new ShopperGiftCertificates(config),
    shopperLogin: new ShopperLogin(config),
    shopperOrders: new ShopperOrders(config),
    shopperProducts: new ShopperProducts(config),
    shopperPromotions: new ShopperPromotions(config),
    shopperSearch: new ShopperSearch(config),
    shopperSeo: new ShopperSeo(config),
  };
}
