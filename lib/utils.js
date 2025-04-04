import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  // Spread the inputs array into individual arguments for clsx
  return twMerge(clsx(...inputs));
}
