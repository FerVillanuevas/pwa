// Require the parts of the module you want to use.
import { Client, CheckoutAPI } from "@adyen/api-library";

// Set up the client and service.
const client = new Client({
  apiKey: process.env.ADYEN_API_KEY!,
  environment: process.env.ADYEN_ENVIRONMENT! as Environment,
});

//@ts-ignore
let checkoutApi = global.checkoutApi;

if (!checkoutApi) {
  checkoutApi = new CheckoutAPI(client);
}

export default checkoutApi;
