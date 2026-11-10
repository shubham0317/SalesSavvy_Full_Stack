import { API_BASE_URL } from "../utils/constants";

/**
 * Universal request helper for SalesSavvy Frontend API calls.
 * Handles fetch & XHR for GET with body, credentials, JWT auth headers, and response parsing.
 */
export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;
  const method = (options.method || "GET").toUpperCase();
  const token = localStorage.getItem("token");

  const headers = {
    ...options.headers,
  };

  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Handle GET with body using XMLHttpRequest (browser fetch limitation)
  if (method === "GET" && options.body !== undefined && options.body !== null) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.withCredentials = true;

      if (!headers["Content-Type"]) {
        xhr.setRequestHeader("Content-Type", "application/json");
      }
      for (const [key, value] of Object.entries(headers)) {
        xhr.setRequestHeader(key, value);
      }

      xhr.onload = () => {
        let text = xhr.responseText;
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({ ok: true, status: xhr.status, data });
        } else {
          const errorMessage =
            typeof data === "string" && data.trim().length > 0
              ? data
              : data?.message || data?.error || "Request failed";
          resolve({ ok: false, status: xhr.status, data, error: errorMessage });
        }
      };

      xhr.onerror = () => {
        resolve({ ok: false, status: 0, error: "Unable to connect to server." });
      };

      const bodyData =
        typeof options.body === "object"
          ? JSON.stringify(options.body)
          : options.body;
      xhr.send(bodyData);
    });
  }

  // Standard fetch for all other requests
  try {
    const fetchOptions = {
      method,
      credentials: "include",
      headers,
    };

    if (options.body !== undefined && options.body !== null) {
      if (!headers["Content-Type"]) {
        fetchOptions.headers["Content-Type"] = "application/json";
      }
      fetchOptions.body =
        typeof options.body === "object"
          ? JSON.stringify(options.body)
          : options.body;
    }

    const response = await fetch(url, fetchOptions);
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!response.ok) {
      const errorMessage =
        typeof data === "string" && data.trim().length > 0
          ? data
          : data?.message || data?.error || "Request failed";
      return { ok: false, status: response.status, data, error: errorMessage };
    }

    return { ok: true, status: response.status, data };
  } catch (error) {
    console.error("API Request Error:", error);
    return { ok: false, status: 0, error: "Unable to connect to server." };
  }
}
