"use server";

import { createClient } from "@/lib/commerce-kit";

export async function ProductSearch({ query }: { query?: string }) {
  const client = await createClient();

  const suggestions = await client.shopperSearch.productSearch({
    parameters: {
      q: query,
    }
  });

  return suggestions;
}

export default async function SearchSuggestions({ query }: { query?: string }) {
  const client = await createClient();


  const suggestions = await client.shopperSearch.getSearchSuggestions({
    parameters: {
      q: query || "t shirt",
    }
  });

  return suggestions;
}
