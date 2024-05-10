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
} from "commerce-sdk-isomorphic";

const CLIENT_ID = process.env.CLIENT_ID;
const ORG_ID = process.env.ORG_ID;
const SHORT_CODE = process.env.SHORT_CODE;
const SITE_ID = process.env.SITE_ID;

const config = {
  headers: {},
  parameters: {
    clientId: CLIENT_ID,
    organizationId: ORG_ID,
    shortCode: SHORT_CODE,
    siteId: SITE_ID,
  },
  throwOnBadResponse: true,
};

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

export const shopperBaskets = new ShopperBaskets(config);
export const shopperContexts = new ShopperContexts(config);
export const shopperCustomers = new ShopperCustomers(config);
export const shopperExperience = new ShopperExperience(config);
export const shopperGiftCertificates = new ShopperGiftCertificates(config);
export const shopperLogin = new ShopperLogin(config);
export const shopperOrders = new ShopperOrders(config);
export const shopperProducts = new ShopperProducts(config);
export const shopperPromotions = new ShopperPromotions(config);
export const shopperSearch = new ShopperSearch(config);
export const shopperSeo = new ShopperSeo(config);
