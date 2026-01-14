const normalizedEnvBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
const defaultApiOrigin = import.meta.env.DEV ? "http://localhost:5000" : "";
const apiOrigin = normalizedEnvBase || defaultApiOrigin;
const API_BASE_URL = apiOrigin
  ? apiOrigin.endsWith("/api")
    ? apiOrigin
    : `${apiOrigin}/api`
  : "/api";

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

export const updateProfile = async (payload) => {
  const profilePayload = {
    firstName: payload.firstName?.trim(),
    lastName: payload.lastName?.trim(),
    username: payload.username?.trim(),
    mobile: payload.mobile?.trim(),
    country: payload.country?.trim(),
    occupation: payload.occupation?.trim(),
    region: payload.region?.trim(),
    cityOrVillage: payload.cityOrVillage?.trim(),
    gender: payload.gender,
  };

  if ("avatar" in payload) {
    profilePayload.avatar = payload.avatar;
  }

  if ("visibleToOtherUsers" in payload) {
    profilePayload.visibleToOtherUsers = payload.visibleToOtherUsers;
  }

  return handleResponse(
    await fetch(
      `${API_BASE_URL}/auth/profile`,
      buildJsonRequest(profilePayload, "PUT")
    )
  );
};

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

export const listNews = async () =>
  handleResponse(
    await fetch(`${API_BASE_URL}/news`, {
      credentials: "include",
    })
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

export const listVisibleUsers = async () =>
  handleResponse(
    await fetch(`${API_BASE_URL}/public-users/visible`, {
      credentials: "include",
    })
  );

export const updateUserRole = async (userId, role) =>
  handleResponse(
    await fetch(
      `${API_BASE_URL}/users/${userId}/role`,
      buildJsonRequest({ role }, "PUT")
    )
  );

export const submitContactMessage = async (payload) =>
  handleResponse(
    await fetch(
      `${API_BASE_URL}/contact`,
      buildJsonRequest({
        name: payload.name?.trim(),
        email: normalizeEmail(payload.email),
        topic: payload.topic?.trim(),
        message: payload.message?.trim(),
      })
    )
  );

export const createPoll = async (payload) =>
  handleResponse(
    await fetch(
      `${API_BASE_URL}/polls/`,
      buildJsonRequest({
        question: payload.question?.trim(),
        options: payload.options, // Keep as-is (can be string[] or object[])
        tags: payload.tags,
        region: payload.region?.trim(),
        cityOrVillage: payload.cityOrVillage?.trim(),
        isAnonymousCreator: Boolean(payload.isAnonymousCreator),
        anonymousResponses: Boolean(payload.anonymousResponses),
        allowUserOptions: Boolean(payload.allowUserOptions),
        userOptionApproval: payload.userOptionApproval,
        optionsArePeople: Boolean(payload.optionsArePeople),
        linkPolicy: payload.linkPolicy,
      })
    )
  );

export const listPolls = async () =>
  handleResponse(
    await fetch(`${API_BASE_URL}/polls/`, {
      credentials: "include",
    })
  );

export const getPoll = async (pollId) =>
  handleResponse(
    await fetch(`${API_BASE_URL}/polls/${pollId}`, {
      credentials: "include",
    })
  );

export const voteOnPoll = async (pollId, optionId) =>
  handleResponse(
    await fetch(
      `${API_BASE_URL}/polls/${pollId}/vote`,
      buildJsonRequest({ optionId })
    )
  );

export const cancelVoteOnPoll = async (pollId) =>
  handleResponse(
    await fetch(
      `${API_BASE_URL}/polls/${pollId}/vote`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    )
  );

export const getMyPolls = async () =>
  handleResponse(
    await fetch(`${API_BASE_URL}/polls/my-polls`, {
      credentials: "include",
    })
  );

export const getPollStatistics = async (pollId) =>
  handleResponse(
    await fetch(`${API_BASE_URL}/polls/${pollId}/statistics`, {
      credentials: "include",
    })
  );

export const deletePoll = async (pollId) =>
  handleResponse(
    await fetch(
      `${API_BASE_URL}/polls/${pollId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    )
  );

export const addOptionToPoll = async (pollId, option) =>
  handleResponse(
    await fetch(
      `${API_BASE_URL}/polls/${pollId}/options`,
      buildJsonRequest({ option })
    )
  );

export const listPendingOptions = async (pollId) =>
  handleResponse(
    await fetch(`${API_BASE_URL}/polls/${pollId}/options/pending`, {
      credentials: "include",
    })
  );

export const approveOption = async (pollId, optionId) =>
  handleResponse(
    await fetch(
      `${API_BASE_URL}/polls/${pollId}/options/${optionId}/approve`,
      buildJsonRequest({})
    )
  );

export const deleteOption = async (pollId, optionId) =>
  handleResponse(
    await fetch(
      `${API_BASE_URL}/polls/${pollId}/options/${optionId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    )
  );

// Articles API
export const listArticles = async () =>
  handleResponse(
    await fetch(`${API_BASE_URL}/articles/`, {
      credentials: "include",
    })
  );

export const getMyArticles = async () =>
  handleResponse(
    await fetch(`${API_BASE_URL}/articles/my-articles`, {
      credentials: "include",
    })
  );

export const getArticle = async (articleId) =>
  handleResponse(
    await fetch(`${API_BASE_URL}/articles/${articleId}`, {
      credentials: "include",
    })
  );

export const createArticle = async (payload) =>
  handleResponse(
    await fetch(
      `${API_BASE_URL}/articles/`,
      buildJsonRequest({
        title: payload.title?.trim(),
        content: payload.content?.trim(),
        tags: payload.tags,
        region: payload.region?.trim(),
        cityOrVillage: payload.cityOrVillage?.trim(),
      })
    )
  );

export const updateArticle = async (articleId, payload) =>
  handleResponse(
    await fetch(
      `${API_BASE_URL}/articles/${articleId}`,
      buildJsonRequest({
        title: payload.title?.trim(),
        content: payload.content?.trim(),
        tags: payload.tags,
        region: payload.region?.trim(),
        cityOrVillage: payload.cityOrVillage?.trim(),
      }, "PUT")
    )
  );

export const deleteArticle = async (articleId) =>
  handleResponse(
    await fetch(
      `${API_BASE_URL}/articles/${articleId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    )
  );

export const tagArticleAsNews = async (articleId) =>
  handleResponse(
    await fetch(
      `${API_BASE_URL}/articles/${articleId}/tag-as-news`,
      buildJsonRequest({}, "PUT")
    )
  );

export const untagArticleAsNews = async (articleId) =>
  handleResponse(
    await fetch(
      `${API_BASE_URL}/articles/${articleId}/untag-as-news`,
      buildJsonRequest({}, "PUT")
    )
  );

export { API_BASE_URL };
