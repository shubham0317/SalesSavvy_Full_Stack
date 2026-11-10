import { apiRequest } from "./apiClient";

export async function fetchCartItems() {
  return apiRequest("/api/cart/items", {
    method: "GET",
  });
}

export async function fetchCartCount(username) {
  const query = username ? `?username=${encodeURIComponent(username)}` : "";
  return apiRequest(`/api/cart/items/count${query}`, {
    method: "GET",
  });
}

export async function addToCart(username, productId) {
  return apiRequest("/api/cart/add", {
    method: "POST",
    body: { username, productId },
  });
}

export async function updateCartQuantity(username, productId, quantity) {
  return apiRequest("/api/cart/update", {
    method: "PUT",
    body: { username, productId, quantity },
  });
}

export async function removeCartItem(username, productId) {
  return apiRequest("/api/cart/delete", {
    method: "DELETE",
    body: { username, productId },
  });
}
