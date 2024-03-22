import { ShopperLogin } from "commerce-sdk/dist/customer/customer";
import { SignJWT, jwtVerify } from "jose";

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

export async function encrypt(payload: any, expires: string | number | Date) {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(expires)
		.sign(key);
}

export async function decrypt(input: string): Promise<any> {
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

export async function getGuestUserAuthToken(request: NextRequest) {
	const response = NextResponse.next();
	const session = request.cookies.get("session")?.value;

	if (session) {
		return response;
	}

	const base64data = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
		"base64",
	);

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

	const exp = Date.now() + 1800 * 1000
	const token = await res.json();
	const encSession = await encrypt(token, exp);

	response.cookies.set("session", encSession, {
		httpOnly: true,
		expires: exp
	});

	return response;
}
