import { getSession } from "@/lib/commerce";
import { shopperCustomers } from "@/lib/global";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getSession();

  let customer;
  try {
    customer = await shopperCustomers.getCustomer({
      parameters: {
        //@ts-ignore
        customerId: session.customer_id,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
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
