import { apiRequest } from "./apiClient";

export async function fetchUserOrders() {
  return apiRequest("/api/orders", {
    method: "GET",
  });
}
