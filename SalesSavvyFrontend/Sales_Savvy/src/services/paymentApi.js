import { apiRequest } from "./apiClient";

export async function createRazorpayOrder(totalAmount, cartItems) {
  return apiRequest("/api/payment/create", {
    method: "POST",
    body: {
      totalAmount,
      cartItems,
    },
  });
}

export async function verifyRazorpayPayment(paymentData) {
  return apiRequest("/api/payment/verify", {
    method: "POST",
    body: paymentData,
  });
}
