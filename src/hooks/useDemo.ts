import { useContext } from 'react';
import { DemoContext } from '../services/DemoContext';

export function useDemo() {
  const state = useContext(DemoContext);
  if (!state) throw new Error('DemoProvider es necesario para leer los datos.');
  return state;
}
