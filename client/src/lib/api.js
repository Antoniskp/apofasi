const normalizedEnvBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");

const API_BASE_URL =
  normalizedEnvBase || (import.meta.env.DEV ? "http://localhost:5000" : "/api");

const normalizeEmail = (email) => (email ? String(email).trim().toLowerCase() : "");

const buildJsonRequest = (payload, method = "POST") => ({
  method,
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

export const updateProfile = async (payload) =>
  handleResponse(
    await fetch(
      `${API_BASE_URL}/auth/profile`,
      buildJsonRequest({
        firstName: payload.firstName?.trim(),
        lastName: payload.lastName?.trim(),
        username: payload.username?.trim(),
        mobile: payload.mobile?.trim(),
        country: payload.country?.trim(),
        occupation: payload.occupation?.trim()
      }, "PUT")
    )
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

export const createNews = async (payload) =>
  handleResponse(
    await fetch(
      `${API_BASE_URL}/news`,
      buildJsonRequest({
        title: payload.title?.trim(),
        content: payload.content?.trim()
      })
    )
  );

export const listUsers = async (searchTerm = "") => {
  const params = new URLSearchParams();

  if (searchTerm?.trim()) {
    params.set("search", searchTerm.trim());
  }

  const query = params.toString();

  return handleResponse(
    await fetch(`${API_BASE_URL}/users${query ? `?${query}` : ""}`, {
      credentials: "include"
    })
  );
};

export const updateUserRole = async (userId, role) =>
  handleResponse(
    await fetch(
      `${API_BASE_URL}/users/${userId}/role`,
      buildJsonRequest({ role }, "PUT")
    )
  );

export { API_BASE_URL };
