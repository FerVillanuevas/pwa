import { RecommenderType } from "@/lib/Einstain";
import RecomendationsCarousel from "../../components/recomendations-carousel";

export default function CompletePage({ params }: { params: { id: string } }) {
  return (
    <div className="container divide-y space-y-4">
      <h1 className="text-center text-2xl">Recently Viewed</h1>
      <RecomendationsCarousel
        className="pt-4"
        product={{ id: params.id }}
        type={RecommenderType.PDP_RECENTLY_VIEWED}
      />
    </div>
  );
}
