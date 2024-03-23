"use client";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import type { Search } from "commerce-sdk";
import { Checkbox } from "../ui/checkbox";

export default function Refinament({
	refinaments,
}: { refinaments: Search.ShopperSearch.ProductSearchRefinement[] }) {
	return (
		<Accordion>
			{refinaments.map((refinament) => {
				return (
					<AccordionItem
						key={refinament.attributeId}
						aria-label={refinament.label}
						title={refinament.label}
					>
						<div className="space-y-2">
							{refinament.values?.map(
								(value: Search.ShopperSearch.ProductSearchRefinementValue) => {
									return (
										<div key={value.value} className="flex items-center space-x-2">
											<Checkbox id={value.value} />
											<label
												htmlFor={value.value}
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												{value.label}
											</label>
										</div>
									);
								},
							)}
						</div>
					</AccordionItem>
				);
			})}
		</Accordion>
	);
}
