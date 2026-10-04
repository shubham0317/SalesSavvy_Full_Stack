/**
 * Format currency in Indian Rupees (INR)
 */
export function formatCurrency(amount) {
  const numericAmount = Number(amount) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

/**
 * Capitalize first letter of string
 */
export function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
