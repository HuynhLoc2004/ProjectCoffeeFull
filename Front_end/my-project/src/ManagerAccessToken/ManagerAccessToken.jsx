// tokenManager.js
const TOKEN_KEY = "access_token";

export const setAccessToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEY) || "";
};

export const isAccessTokenExpired = (
  token = getAccessToken(),
  clockSkewSeconds = 30,
) => {
  if (!token) return true;

  try {
    const encodedPayload = token.split(".")[1];
    if (!encodedPayload) return true;

    const normalizedPayload = encodedPayload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(encodedPayload.length / 4) * 4, "=");
    const payload = JSON.parse(atob(normalizedPayload));

    return (
      !payload.exp ||
      payload.exp * 1000 <= Date.now() + clockSkewSeconds * 1000
    );
  } catch {
    return true;
  }
};

export const clearAccessToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
