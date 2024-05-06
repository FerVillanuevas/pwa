import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { RecommenderType, getRecomendations } from "@/lib/Einstain";
import { cn } from "@/lib/utils";
import { ShopperProducts } from "commerce-sdk/dist/product/product";
import { isEmpty } from "lodash";
import Image from "next/image";
import Link from "next/link";

export default async function RecomendationsCarousel({
  product,
  type,
  className,
  title,
}: {
  product: ShopperProducts.Product;
  type: RecommenderType;
  title: string;
  className?: string;
}) {
  const { recs } = await getRecomendations(type, [product]);

  if (isEmpty(recs)) return <></>;

  return (
    <div className="container divide-y space-y-4">
      <h1 className="text-center text-2xl">{title}</h1>

      <div className={cn("px-6", className)}>
        <Carousel className="w-full">
          <CarouselContent className="-ml-1">
            {recs.map((hit) => (
              <CarouselItem
                key={hit.id}
                className="pl-1 md:basis-1/2 lg:basis-1/3"
              >
                <Link href={`/product/${hit.id}`} className="p-1">
                  <Card className="overflow-hidden">
                    <CardContent className="flex aspect-square items-center justify-center p-0 ">
                      <Image
                        width={200}
                        height={200}
                        src={hit.image_url}
                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                        alt={hit.product_name}
                        priority
                      />
                    </CardContent>
                  </Card>
                  <h3 className="mt-4 text-sm text-foreground">
                    {hit.product_name}
                  </h3>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
