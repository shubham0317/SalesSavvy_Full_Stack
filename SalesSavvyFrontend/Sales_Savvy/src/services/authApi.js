import { apiRequest } from "./apiClient";

export async function loginUser(credentials) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: credentials,
  });
}

export async function registerUser(userData) {
  return apiRequest("/api/users/register", {
    method: "POST",
    body: userData,
  });
}

export async function logoutUser() {
  return apiRequest("/api/auth/logout", {
    method: "POST",
  });
}
