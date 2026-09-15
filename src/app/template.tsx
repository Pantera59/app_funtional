import type { ReactNode } from 'react';

/** Remounts on every navigation, replaying the CSS entrance animation without client JS. */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="animate-page-in pt-8 motion-reduce:animate-none">{children}</div>;
}
