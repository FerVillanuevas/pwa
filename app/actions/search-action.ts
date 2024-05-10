"use server";

import { getSession } from "@/lib/commerce";
import { shopperSearch } from "@/lib/global";

export async function ProductSearch({ query }: { query?: string }) {
  const token = await getSession();


  const suggestions = shopperSearch.productSearch({
    parameters: {
      q: query,
    },
    headers: {
      authorization: `Bearer ${token?.access_token}`,
    },
  });

  return suggestions;
}

export default async function SearchSuggestions({ query }: { query?: string }) {
  const token = await getSession();


  const suggestions = shopperSearch.getSearchSuggestions({
    parameters: {
      q: query || "t shirt",
    },
    headers: {
      authorization: `Bearer ${token?.access_token}`,
    },
  });

  return suggestions;
}
