"use client";

import { ChevronsUpDownIcon, Menu, Package2 } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import Link from "./Link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Checkbox } from "../ui/checkbox";
import { ShopperSearchTypes } from "commerce-sdk-isomorphic";

export default function MobileRefinaments({
  refinaments,
}: {
  refinaments: ShopperSearchTypes.ProductSearchRefinement[];
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="shrink-0 md:hidden">
          Filters
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="grid gap-6 text-lg font-medium">
          <span>Filters</span>

          {refinaments.map((refinament) => {
            return (
              <Collapsible
                key={refinament.attributeId}
                defaultOpen={true}
                className="border-b py-4"
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between ">
                    <h4 className="font-medium text-sm">{refinament.label}</h4>

                    <Button variant="ghost" size="sm" className="w-9 p-0">
                      <ChevronsUpDownIcon className="h-4 w-4" />
                      <span className="sr-only">{refinament.label}</span>
                    </Button>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-6">
                  {refinament.values?.map((value) => {
                    return (
                      <div
                        key={value.value}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <Checkbox id={value.value} />
                        <label
                          htmlFor={value.value}
                          className="text-sm text-secondary-foreground cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {value.label} {value.hitCount}
                        </label>
                      </div>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
