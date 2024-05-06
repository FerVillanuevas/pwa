import { RecommenderType } from "@/lib/Einstain";
import RecomendationsCarousel from "../../components/recomendations-carousel";

export default function CompletePage({ params }: { params: { id: string } }) {
  return (
    <RecomendationsCarousel
      className="pt-4"
      product={{ id: params.id }}
      title="demo"
      type={RecommenderType.PDP_COMPLETE_SET}
    />
  );
}
