import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function để merge các className với Tailwind CSS
 * Sử dụng clsx và tailwind-merge để xử lý conflict
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
