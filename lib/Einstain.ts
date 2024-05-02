import { ShopperProducts } from "commerce-sdk/dist/product/product";
import axios from "axios";

export enum RecommenderType {
    ADD_TO_CART_MODAL = 'pdp-similar-items',
    CART_RECENTLY_VIEWED = 'viewed-recently-einstein',
    CART_MAY_ALSO_LIKE = 'product-to-product-einstein',
    PDP_COMPLETE_SET = 'complete-the-set',
    PDP_MIGHT_ALSO_LIKE = 'pdp-similar-items',
    PDP_RECENTLY_VIEWED = 'viewed-recently-einstein',
    EMPTY_SEARCH_RESULTS_TOP_SELLERS = 'home-top-revenue-for-category',
    EMPTY_SEARCH_RESULTS_MOST_VIEWED = 'products-in-all-categories'
}

export type ERecomendation = {
    id: string,
    product_name: string,
    image_url: string,
    product_url: string
}

export async function getRecomendations(
  recommender: RecommenderType,
  products: ShopperProducts.Product[]
): Promise<{recs: ERecomendation[], recoUUID: string}> {
  const { data } = await axios.post(
    `https://api.cquotient.com/v3/personalization/recs/aaij-MobileFirst/${recommender}`,
    {
      products,
    },
    {
      headers: {
        "x-cq-client-id": "1ea06c6e-c936-4324-bcf0-fada93f83bb1",
        Accept: "application/json",
      },
    }
  );

  return data;
}
