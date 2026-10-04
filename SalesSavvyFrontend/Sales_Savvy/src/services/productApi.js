import { apiRequest } from "./apiClient";

export async function fetchProductsByCategory(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return apiRequest(`/api/products${query}`, {
    method: "GET",
  });
}
