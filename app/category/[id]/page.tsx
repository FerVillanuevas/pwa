import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getSession } from "@/lib/commerce";
import { shopperSearch } from "@/lib/global";
import { Search } from "commerce-sdk";
import currency from "currency.js";
import { isArray } from "lodash";
import { ChevronsUpDownIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

interface ICategoryPage {
  params: {
    id: string;
  };
  searchParams: {
    limit?: number;
    refine?: string[] | string;
    sort?: string;
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: ICategoryPage) {
  const token = await getSession();
  if (!token) return <div>Error</div>;

  const { id } = params;

  if (!isArray(searchParams.refine)) {
    const refine = searchParams.refine!;
    searchParams.refine = [refine, `cgid=${id}`];
  } else {
    searchParams.refine = [...searchParams.refine, `cgid=${id}`];
  }

  const products = await shopperSearch.productSearch({
    //@ts-ignore
    parameters: {
      ...searchParams,
    },
    headers: {
      authorization: `Bearer ${token.access_token}`,
    },
    next: { tags: ["category", id] },
  });

  const categoryRefinament:
    | Search.ShopperSearch.ProductSearchRefinement
    | undefined = products.refinements.find(
    ({ attributeId, values }) => attributeId === "cgid" && values
  );

  const refinaments = products.refinements.filter(
    ({ attributeId, values }) => attributeId !== "cgid" && values
  );

  return (
    <section className="pt-6 container">
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4 ">
        <div>
          {categoryRefinament && (
            <ul className="space-y-4 border-b pb-6 text-sm font-medium text-foreground">
              {categoryRefinament.values?.map((value) => {
                return (
                  <li key={value.value}>
                    <Link href={"#"}>{value.label}</Link>
                  </li>
                );
              })}
            </ul>
          )}

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
        </div>

        <div className="col-span-3">
          <h2 className="sr-only">Products</h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products?.hits?.map((hit) => {
              return (
                <Link
                  href={`/product/${hit.productId}`}
                  key={hit.productId}
                  className="group"
                >
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                    <Suspense fallback={<p>loaing...</p>}>
                      <Image
                        width={200}
                        priority={true}
                        height={200}
                        src={hit.image?.disBaseLink || ""}
                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                        alt={hit.image?.alt || ""}
                      />
                    </Suspense>
                  </div>
                  <h3 className="mt-4 text-sm text-foreground">
                    {hit.productName}
                  </h3>
                  <p className="mt-1 text-lg font-medium text-secondary-foreground">
                    {currency(hit.price || 0).format()}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
