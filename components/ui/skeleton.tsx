import type React from 'react';
import { cn } from '../lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-amber-100/50', className)}
      {...props}
    />
  );
}

export { Skeleton };
