
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to conditionally apply light/dark mode styles
export function themeClass(darkClass: string, lightClass: string, isDark: boolean) {
  return isDark ? darkClass : lightClass
}

/**
 * Formats a number using the Indian number system (lakhs and crores)
 * @param amount - The number to format
 * @param currency - Whether to include the ₹ symbol (default: true)
 * @returns The formatted price string
 */
export function formatIndianPrice(amount: number | string, currency: boolean = true): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Format with Indian number system (commas after 3 digits, then every 2 digits)
  const formatter = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  });
  
  return currency ? `₹${formatter.format(numericAmount)}` : formatter.format(numericAmount);
}
