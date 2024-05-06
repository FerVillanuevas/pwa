import { RecommenderType } from "@/lib/Einstain";
import RecomendationsCarousel from "../../components/recomendations-carousel";

export default function CompletePage({ params }: { params: { id: string } }) {
  return (
    <RecomendationsCarousel
      className="pt-4"
      title="You might also like"
      product={{ id: params.id }}
      type={RecommenderType.PDP_MIGHT_ALSO_LIKE}
    />
  );
}
