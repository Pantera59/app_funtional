'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/** False during the server render and hydration, true afterwards. */
export const useIsClient = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
