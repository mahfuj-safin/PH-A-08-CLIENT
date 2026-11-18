const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

let cachedToken = null;

export function clearAuthToken() {
  cachedToken = null;
}

export async function getJwtToken() {
  if (cachedToken) return cachedToken;

  const res = await fetch("/api/jwt", { credentials: "include" });
  if (!res.ok) return null;

  const data = await res.json();
  cachedToken = data.token;
  return cachedToken;
}

// Public fetch (no JWT needed — e.g. GET /books)
export async function publicFetch(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

// Private fetch (automatically attaches Bearer JWT token)
export async function authFetch(endpoint, options = {}) {
  let token = await getJwtToken();

  if (!token) {
    throw new Error("Please log in to continue");
  }

  let res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  // If token expired, refresh once and retry
  if (res.status === 401) {
    cachedToken = null;
    token = await getJwtToken();
    if (token) {
      res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });
    }
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}