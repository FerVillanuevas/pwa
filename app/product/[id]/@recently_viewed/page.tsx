import { RecommenderType } from "@/lib/Einstain";
import RecomendationsCarousel from "../../components/recomendations-carousel";

export default function CompletePage({ params }: { params: { id: string } }) {
  return (
    <RecomendationsCarousel
      className="pt-4"
      title="Recently Viewed"
      product={{ id: params.id }}
      type={RecommenderType.PDP_RECENTLY_VIEWED}
    />
  );
}
