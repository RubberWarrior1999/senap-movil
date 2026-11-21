import { AnimalsView } from '../../../components/animales/AnimalsView';
import { useAnimals } from '../../../hooks/useAnimals';

export default function AnimalsPage() {
  const view = useAnimals();
  return <AnimalsView {...view} />;
}
