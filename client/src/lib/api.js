const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:5000" : "");

const normalizeEmail = (email) => (email ? String(email).trim().toLowerCase() : "");

const buildJsonRequest = (payload) => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify(payload)
});

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }
  return data;
};

export const getAuthStatus = async () =>
  handleResponse(
    await fetch(`${API_BASE_URL}/auth/status`, {
      credentials: "include"
    })
  );

export const registerUser = async (payload) =>
  handleResponse(
    await fetch(
      `${API_BASE_URL}/auth/register`,
      buildJsonRequest({
        displayName: payload.displayName?.trim(),
        email: normalizeEmail(payload.email),
        password: payload.password
      })
    )
  );

export const loginUser = async (payload) =>
  handleResponse(
    await fetch(
      `${API_BASE_URL}/auth/login`,
      buildJsonRequest({
        email: normalizeEmail(payload.email),
        password: payload.password
      })
    )
  );

export const logoutUser = async () =>
  handleResponse(
    await fetch(`${API_BASE_URL}/auth/logout`, {
      credentials: "include"
    })
  );

export { API_BASE_URL };
