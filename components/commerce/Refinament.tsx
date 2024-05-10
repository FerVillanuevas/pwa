"use client";
import type { Search } from "commerce-sdk";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";

export default function Refinament({
  refinaments,
}: {
  refinaments: Search.ShopperSearch.ProductSearchRefinement[];
}) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {refinaments?.map(
        (refinament: Search.ShopperSearch.ProductSearchRefinement) => {
          return (
            <AccordionItem key={refinament.id} value={refinament.id}>
              <AccordionTrigger>{refinament.name}</AccordionTrigger>
              <AccordionContent className="flex flex-col">
                {refinament.values?.map((value) => {
                  return <p key={value.value}>{value.label}</p>;
                })}
              </AccordionContent>
            </AccordionItem>
          );
        }
      )}
    </Accordion>
  );
}
