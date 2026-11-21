import { createContext } from 'react';
import type { useDemoState } from '../hooks/useDemoState';

export type DemoState = ReturnType<typeof useDemoState>;
export const DemoContext = createContext<DemoState | null>(null);
