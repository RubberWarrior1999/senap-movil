import { AnimalDetailView } from '../../../../components/animales/AnimalDetailView';
import { useAnimalDetail } from '../../../../hooks/useAnimalDetail';

export default function AnimalDetailPage() {
  const view = useAnimalDetail();
  return <AnimalDetailView {...view} />;
}
