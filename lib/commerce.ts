import { JWTPayload, SignJWT, jwtVerify } from "jose";
import {
	RequestCookies,
	ResponseCookies,
} from "next/dist/compiled/@edge-runtime/cookies";

import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const CLIENT_ID = "da422690-7800-41d1-8ee4-3ce983961078";
const CLIENT_SECRET = "D*HHUrgO2%qADp2JTIUi";
const ORG_ID = "f_ecom_zzte_053";
const SHORT_CODE = "kv7kzm78";
const SITE_ID = "RefArch";

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

export async function encrypt(payload: JWTPayload | undefined, expires: string | number | Date) {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(expires)
		.sign(key);
}

export async function decrypt(input: string): Promise<JWTPayload> {
	const { payload } = await jwtVerify(input, key, {
		algorithms: ["HS256"],
	});
	return payload;
}

export async function getSession() {
	const session = cookies().get("session")?.value;
	if (!session) return null;
	return await decrypt(session);
}

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

async function storeToken(token: JWTPayload, request: NextRequest, response: NextResponse) {
	const exp = Date.now() + 1800 * 1000;
	const expRefresh = Date.now() + 2592000 * 1000;

	const encSession = await encrypt(token, exp);
	const encRefresh = await encrypt(
		{
			refresh_token: token.refresh_token,
			exp: 2592000,
		},
		expRefresh,
	);

	response.cookies.set("session", encSession, {
		httpOnly: true,
		expires: exp,
	});

	response.cookies.set("refreshToken", encRefresh, {
		httpOnly: true,
		expires: expRefresh,
	});
}

export async function getGuestUserAuthToken(request: NextRequest) {
	const response = NextResponse.next();
	const session = request.cookies.get("session")?.value;
	const refreshToken = request.cookies.get("refreshToken")?.value;

	if (session) {
		return response;
	}

	const base64data = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
		"base64",
	);

	if (refreshToken) {
		const decryptToken = await decrypt(refreshToken);

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
			},
		);

		const token = await res.json();

		await storeToken(token, request, response);

		applySetCookie(request, response);

		return response;
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
		},
	);

	const token = await res.json();

	await storeToken(token, request, response);

	applySetCookie(request, response);

	return response;
}
