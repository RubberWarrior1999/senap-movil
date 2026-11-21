import type { PropsWithChildren } from 'react';
import { useDemoState } from '../hooks/useDemoState';
import { DemoContext } from './DemoContext';

export function DemoProvider({ children }: PropsWithChildren) {
  return <DemoContext.Provider value={useDemoState()}>{children}</DemoContext.Provider>;
}
