import { cn } from "@/lib/utils";
import NextLink, { LinkProps } from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { ReactNode } from "react";

export type ButtonProps = VariantProps<typeof buttonVariants>;

interface ILinkProps extends LinkProps, ButtonProps {
  className?: string;
  children: ReactNode;
  icon?: ReactNode;
}

export default function Link({
  className,
  variant = "ghost",
  size = "default",
  children,
  icon,
  ...props
}: ILinkProps) {
  return (
    <NextLink
      className={cn(
        buttonVariants({ variant, size }),
        "h-auto py-1.5 gap-2 justify-start",
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </NextLink>
  );
}
