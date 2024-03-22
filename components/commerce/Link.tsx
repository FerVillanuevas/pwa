import { cn } from "@/lib/utils";
import NextLink from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function Link({ className, variant = "ghost", children, icon, ...props }: any) {
	return <NextLink className={cn(buttonVariants({ variant }), 'h-auto py-1.5 gap-2 justify-start', className)} {...props}>
    {icon} {children}
  </NextLink>;
}
