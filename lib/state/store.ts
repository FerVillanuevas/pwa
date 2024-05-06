import { observable } from "@legendapp/state";
import { ShopperBaskets } from "commerce-sdk/dist/checkout/checkout";

interface IState {
  basket: ShopperBaskets.Basket;
}

export const store$ = observable<IState>();
