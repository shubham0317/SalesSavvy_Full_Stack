import { apiRequest } from "./apiClient";

export async function adminRequest(endpoint, options = {}) {
  return apiRequest(endpoint, options);
}

export async function addProduct(productData) {
  return apiRequest("/admin/products/add", {
    method: "POST",
    body: productData,
  });
}

export async function deleteProduct(productId) {
  return apiRequest("/admin/products/delete", {
    method: "DELETE",
    body: { productId: Number(productId) },
  });
}

export async function getUserById(userId) {
  return apiRequest(`/admin/user/getbyid/${userId}`, {
    method: "GET",
  });
}

export async function modifyUser(userData) {
  return apiRequest("/admin/user/modify", {
    method: "PUT",
    body: userData,
  });
}

export async function getMonthlyBusiness(month, year) {
  return apiRequest(`/admin/business/monthly?month=${Number(month)}&year=${Number(year)}`, {
    method: "GET",
  });
}

export async function getDailyBusiness(date) {
  return apiRequest(`/admin/business/daily?date=${date}`, {
    method: "GET",
  });
}

export async function getYearlyBusiness(year) {
  return apiRequest(`/admin/business/yearly?year=${Number(year)}`, {
    method: "GET",
  });
}

export async function getOverallBusiness() {
  return apiRequest("/admin/business/overall", {
    method: "GET",
  });
}
