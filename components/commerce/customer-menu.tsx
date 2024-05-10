"use client";

import { customer$ } from "@/lib/state/customer";
import { Button } from "../ui/button";
import Link from "next/link";
import { UserIcon } from "lucide-react";

export default function CustomerMenu() {
  const customer = customer$.customer.get();

  return (
    <Button variant="outline" className="capitalize px-2 md:px-4" asChild>
      <Link href={"/profile"}>
        <p className="hidden md:flex">{customer?.firstName}</p>
        <UserIcon className="md:hidden h-[1.2rem] w-[1.2rem]" />
      </Link>
    </Button>
  );
}
