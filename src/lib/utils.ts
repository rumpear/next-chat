import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const getClassNames = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
