import { ShopperLogin, ShopperLoginTypes } from "commerce-sdk-isomorphic";
import { type JWTPayload, SignJWT, jwtVerify } from "jose";
import {
  RequestCookies,
  ResponseCookies,
} from "next/dist/compiled/@edge-runtime/cookies";

import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const ORG_ID = process.env.ORG_ID;
const SHORT_CODE = process.env.SHORT_CODE;
const SITE_ID = process.env.SITE_ID;

const SESSION_KEY = "cnx-session";
const REFRESH_TOKEN_KEY = "cnx-refresh";
const USID_KEY = "cnx-usid";

type TSessionToken = {
  access_token: string;
  customer_id: string;
  type: AuthTypes;
  iat: number;
  exp: number;
};

type TRefreshToken = {
  refresh_token: string;
  type: AuthTypes;
  iat: number;
  exp: number;
};

export enum AuthTypes {
  Guest,
  Creadentials,
}

export const config = {
  headers: {},
  parameters: {
    clientId: CLIENT_ID,
    organizationId: ORG_ID,
    shortCode: SHORT_CODE,
    siteId: SITE_ID,
  },
  throwOnBadResponse: true,
};

const key = new TextEncoder().encode(process.env.SECRET_KEY);

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

export async function getSession(): Promise<TSessionToken | null> {
  const session = cookies().get(SESSION_KEY)?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function getUSID(): Promise<string | null> {
  const usid = cookies().get(USID_KEY)?.value;
  if (!usid) return null;
  return usid;
}

export const removeSessionCookie = () => {
  cookies().delete(USID_KEY);

  cookies().delete(SESSION_KEY);

  cookies().delete(REFRESH_TOKEN_KEY);
};

export const handleToken = async (
  token: ShopperLoginTypes.TokenResponse,
  type: AuthTypes
) => {
  const exp = Date.now() + 1800 * 1000;
  const expRefresh = Date.now() + 2592000 * 1000;

  const encSession = await encrypt(
    {
      access_token: token.access_token,
      customer_id: token.customer_id,
      type: type,
    },
    exp
  );

  const encRefresh = await encrypt(
    {
      refresh_token: token.refresh_token,
      exp: 2592000,
      type: type,
    },
    expRefresh
  );

  cookies().set(USID_KEY, token.usid as string, {
    httpOnly: true,
    expires: exp,
  });

  cookies().set(SESSION_KEY, encSession, {
    httpOnly: true,
    expires: exp,
  });

  cookies().set(REFRESH_TOKEN_KEY, encRefresh, {
    httpOnly: true,
    expires: expRefresh,
  });
};

/**
 * Copy cookies from the Set-Cookie header of the response to the Cookie header of the request,
 * so that it will appear to SSR/RSC as if the user already has the new cookies.
 */
export function applySetCookie(req: NextRequest, res: NextResponse): void {
  // parse the outgoing Set-Cookie header
  const setCookies = new ResponseCookies(res.headers);
  // Build a new Cookie header for the request by adding the setCookies
  const newReqHeaders = new Headers(req.headers);
  const newReqCookies = new RequestCookies(newReqHeaders);

  for (const cookie of setCookies.getAll()) {
    newReqCookies.set(cookie);
  }

  NextResponse.next({
    request: { headers: newReqHeaders },
  }).headers.forEach((value, key) => {
    if (
      key === "x-middleware-override-headers" ||
      key.startsWith("x-middleware-request-")
    ) {
      res.headers.set(key, value);
    }
  });
}

export async function storeToken(
  token: JWTPayload,
  response: NextResponse,
  type?: AuthTypes
) {
  const exp = Date.now() + 1800 * 1000;
  const expRefresh = Date.now() + 2592000 * 1000;

  const encSession = await encrypt(
    {
      access_token: token.access_token,
      customer_id: token.customer_id,
      type: type || AuthTypes.Guest,
    },
    exp
  );
  const encRefresh = await encrypt(
    {
      refresh_token: token.refresh_token,
      exp: 2592000,
      type: type || AuthTypes.Guest,
    },
    expRefresh
  );

  response.cookies.set(USID_KEY, token.usid as string, {
    httpOnly: true,
    expires: exp,
  });

  response.cookies.set(SESSION_KEY, encSession, {
    httpOnly: true,
    expires: exp,
  });

  response.cookies.set(REFRESH_TOKEN_KEY, encRefresh, {
    httpOnly: true,
    expires: expRefresh,
  });
}

export async function getGuestUserAuthToken(request: NextRequest) {
  const response = NextResponse.next();
  const session = request.cookies.get(SESSION_KEY)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_KEY)?.value;

  if (session) {
    return;
  }

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

      await storeToken(token, response, decryptToken.type);

      applySetCookie(request, response);

      return response;
    } catch (error) {
      removeSessionCookie()
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

  await storeToken(token, response);

  applySetCookie(request, response);

  return response;
}
