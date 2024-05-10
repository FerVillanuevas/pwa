import { observable } from "@legendapp/state";
import { Customer } from "commerce-sdk";

interface IState {
  customer: Customer.ShopperCustomers.Customer;
}

export const customer$ = observable<IState>();
