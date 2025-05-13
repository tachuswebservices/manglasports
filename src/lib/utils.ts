
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to conditionally apply light/dark mode styles
export function themeClass(darkClass: string, lightClass: string, isDark: boolean) {
  return isDark ? darkClass : lightClass
}
