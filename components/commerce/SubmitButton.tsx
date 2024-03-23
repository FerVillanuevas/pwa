"use client";

import { useFormStatus } from "react-dom";

import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export default function SubmitButton({ children, toastText, ...props }: any) {
	const { pending } = useFormStatus();

    useEffect(() => {
        if(!pending) {
            toast(toastText || "Event has been created.")
        }
    }, [pending])

	return <Button {...props} type="submit" aria-disabled={pending}>
        {pending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />} {children}
    </Button>;
}
