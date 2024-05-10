import type { NextRequest } from "next/server";
import { getGuestUserAuthToken } from "./lib/commerce";

export async function middleware(request: NextRequest) {
  return await getGuestUserAuthToken(request);
}
