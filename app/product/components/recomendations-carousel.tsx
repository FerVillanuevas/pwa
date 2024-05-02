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
import Image from "next/image";
import Link from "next/link";

export default async function RecomendationsCarousel({
  product,
  type,
  className,
}: {
  product: ShopperProducts.Product;
  type: RecommenderType;
  className?: string;
}) {
  const { recs } = await getRecomendations(type, [product]);
  return (
    <div className={cn("px-20", className)}>
      <Carousel>
        <CarouselContent>
          {recs.map((hit) => (
            <CarouselItem key={hit.id} className="basis-1/4">
              <Link href={`/product/${hit.id}`} className="group">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  <Image
                    width={200}
                    height={200}
                    src={hit.image_url || ""}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                    alt={hit.product_name || ""}
                  />
                </div>
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
  );
}
