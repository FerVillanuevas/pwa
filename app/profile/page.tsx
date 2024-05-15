import { createClient } from "@/lib/commerce-kit";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const client = await createClient();

  let customer;
  try {
    customer = await client.shopperCustomers.getCustomer({
      parameters: {
        //@ts-ignore
        customerId: session.customer_id,
      }
    });
  } catch (error) {
    return redirect("/");
  }

  return (
    <div className="container">
      <h1>{customer.firstName}</h1>
      <p>{customer.email}</p>
    </div>
  );
}
