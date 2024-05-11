import { Package2 } from "lucide-react";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-lg font-semibold px-0"
    >
      <Package2 className="h-6 w-6" />
      <span>Acme Inc</span>
    </Link>
  );
}
