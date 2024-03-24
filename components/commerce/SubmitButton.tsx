"use client";

import { useFormStatus } from "react-dom";

import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";

export default function SubmitButton({ children, toastText, ...props }: any) {
	const { pending } = useFormStatus();

	return (
		<Button {...props} type="submit" aria-disabled={pending}>
			{pending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}{" "}
			{children}
		</Button>
	);
}
