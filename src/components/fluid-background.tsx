'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export const FluidBackground = ({ className }: { className?: string }) => {
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const { clientX, clientY } = event;
      blobRef.current?.animate(
        {
          left: `${clientX}px`,
          top: `${clientY}px`,
        },
        { duration: 3000, fill: 'forwards' }
      );
    };

    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <div className={cn('pointer-events-none fixed inset-0 z-[-1] h-full w-full overflow-hidden', className)}>
      <div className="relative h-full w-full bg-background">
        <div
          ref={blobRef}
          className="absolute left-1/2 top-1/2 h-[50vmax] w-[50vmax] -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-accent/10 to-background/10 blur-3xl"
        />
      </div>
    </div>
  );
};
