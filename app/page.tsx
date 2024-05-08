import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getSession } from "@/lib/commerce";
import composable from "@/lib/global";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between container">
      <Suspense fallback={null}>
        <ProductCarousel />
      </Suspense>
    </main>
  );
}

async function ProductCarousel() {
  const token = await getSession();

  const { shopperSearch: searchClient } = composable;

  const searchResults = await searchClient.productSearch({
    parameters: { q: "dress", limit: 8 },
    headers: {
      authorization: `Bearer ${token?.access_token}`,
    },
  });

  return (
    <div className="px-6 w-full">
      <Carousel className="w-full">
        <CarouselContent className="-ml-1">
          {searchResults?.hits?.map((hit) => (
            <CarouselItem
              key={hit.productId}
              className="pl-1 md:basis-1/2 lg:basis-1/4"
            >
               <Link href={`/product/${hit.productId}`} className="p-1">
                <Card className="overflow-hidden">
                  <CardContent className="flex aspect-square items-center justify-center p-0 ">
                    <Image
                      width={200}
                      height={200}
                      src={hit.image?.disBaseLink || ""}
                      className="h-full w-full object-cover object-center group-hover:opacity-75"
                      alt={hit.image?.alt || ""}
                      priority
                    />
                  </CardContent>
                </Card>
                <h3 className="mt-4 text-sm text-foreground">
                  {hit.productName}
                </h3>
                <p className="mt-1 text-lg font-medium text-secondary-foreground">
                  ${hit.price}
                </p>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
