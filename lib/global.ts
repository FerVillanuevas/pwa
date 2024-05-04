import {
  ShopperBaskets,
  ShopperContexts,
  ShopperCustomers,
  ShopperExperience,
  ShopperGiftCertificates,
  ShopperLogin,
  ShopperOrders,
  ShopperProducts,
  ShopperPromotions,
  ShopperSearch,
  ShopperSeo,
} from "commerce-sdk-isomorphic";


import { config } from "./commerce";

// --- API CLIENTS --- //

export type ApiClientConfigParams = {
  clientId: string;
  organizationId: string;
  siteId: string;
  shortCode: string;
  locale?: string;
  currency?: string;
};

export interface ApiClients {
  shopperBaskets: ShopperBaskets<ApiClientConfigParams>;
  shopperContexts: ShopperContexts<ApiClientConfigParams>;
  shopperCustomers: ShopperCustomers<ApiClientConfigParams>;
  shopperExperience: ShopperExperience<ApiClientConfigParams>;
  shopperGiftCertificates: ShopperGiftCertificates<ApiClientConfigParams>;
  shopperLogin: ShopperLogin<ApiClientConfigParams>;
  shopperOrders: ShopperOrders<ApiClientConfigParams>;
  shopperProducts: ShopperProducts<ApiClientConfigParams>;
  shopperPromotions: ShopperPromotions<ApiClientConfigParams>;
  shopperSearch: ShopperSearch<ApiClientConfigParams>;
  shopperSeo: ShopperSeo<ApiClientConfigParams>;
}

//@ts-ignore
let composable: ApiClients = global.composable;



if (!composable) {
  /* Init composable objects */
  composable = {
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

export default composable;
