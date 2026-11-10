import { createContext, useContext, useState, type PropsWithChildren } from 'react';
import { initialHealth, initialMilk, initialTasks, type MilkEntry } from './demo';

function useDemoState() {
  const [health, setHealth] = useState(initialHealth);
  const [tasks, setTasks] = useState(initialTasks);
  const [milk, setMilk] = useState(initialMilk);

  function completeHealth(id: string) {
    setHealth(items => items.map(item => item.id === id ? { ...item, done: true } : item));
  }

  function toggleTask(id: string) {
    setTasks(items => items.map(item => item.id === id ? { ...item, done: !item.done } : item));
  }

  function saveMilk(entry: Omit<MilkEntry, 'id'>) {
    setMilk(items => {
      const existing = items.find(item => item.animal === entry.animal && item.turn === entry.turn);
      if (existing) return items.map(item => item.id === existing.id ? { ...entry, id: item.id } : item);
      return [...items, { ...entry, id: entry.animal + '-' + entry.turn }];
    });
  }

  const totalMilk = milk.reduce((sum, item) => sum + item.liters, 0);
  return { health, tasks, milk, totalMilk, completeHealth, toggleTask, saveMilk };
}

const DemoContext = createContext<ReturnType<typeof useDemoState> | null>(null);

export function DemoProvider({ children }: PropsWithChildren) {
  return <DemoContext.Provider value={useDemoState()}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const state = useContext(DemoContext);
  if (!state) throw new Error('DemoProvider es necesario para leer los datos.');
  return state;
}
