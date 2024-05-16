import { NextRequest } from 'next/server';
import { getGuestUserAuthToken } from './lib/commerce';

export default async function middleware(request: NextRequest) {
  return await getGuestUserAuthToken(request);
}