"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Sheet, SheetContent } from "../ui/sheet";
import { Package2, Search } from "lucide-react";
import { useDebounceCallback } from "usehooks-ts";
import { useMutation } from "@tanstack/react-query";

import { ProductSearch } from "@/app/actions/search-action";
import Link from "./Link";
import { ScrollArea } from "../ui/scroll-area";
import { InferType, object, string } from "yup";
import { Button } from "../ui/button";

const searchScheme = object({
  query: string().required().min(3),
});

type searchFormData = InferType<typeof searchScheme>;

export default function SearchSheet() {

  const [open, setOpen] = useState(false);

  const { mutate, data: searchResults } = useMutation({
    mutationFn: async (fd: searchFormData) => {
      const results = await ProductSearch({
        query: fd.query,
      });
      return results;
    },
  });

  const handleInputChange = useDebounceCallback((e) => {
    e.target.value && mutate({ query: e.target.value });
  }, 500);

  return (
    <Sheet open={open} onOpenChange={(open) => setOpen(open)}>
      <Button variant="outline" size="icon" className="md:hidden">
        <Search
          className="h-[1.2rem] w-[1.2rem] "
          onClick={() => setOpen(true)}
        />
      </Button>
      <Input
        className="hidden md:flex"
        placeholder="search"
        onFocus={() => {
          !open && setOpen(true);
        }}
      />
      <SheetContent
        side="top"
        hideClose={true}
        className="h-svh lg:h-96 flex flex-col"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="gap-4 flex">
            <Package2 className="h-6 w-6" />
            <span className="hidden md:flex">Acme Inc</span>
          </div>

          <div className="max-w-2xl w-full">
            <Input
              autoFocus
              onChange={handleInputChange}
              placeholder="search"
            />
          </div>

          <span
            className="font-bold text-accent-foreground cursor-pointer"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </span>
        </div>

        <ScrollArea className="flex flex-1">
          {searchResults?.hits && (
            <div className="flex flex-col gap-2 mt-4">
              <h1 className="text-muted-foreground">Search Results</h1>
              {searchResults?.hits.map((result) => {
                return (
                  <Link
                    className="px-0"
                    href={`/product/${result.productId}`}
                    key={result.productId}
                  >
                    {result.productName}
                  </Link>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
