'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
}

export default function Card({ children }: CardProps) {
  return (
    <div>
      <div className="card" style={{ margin: 0, padding: 0, borderEndEndRadius: 0, borderEndStartRadius: 0 }}>{children}</div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '0', borderEndEndRadius: 30, borderEndStartRadius: 30, overflow: 'hidden' }}>
        <img src="/honda.jpeg" alt="Honda" style={{ width: 700, height: 'auto', display: 'block' }} />
      </div>
    </div>
  );
}
