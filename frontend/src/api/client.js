const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const STORAGE_KEYS = {
  accessToken: 'hrms_access_token',
  refreshToken: 'hrms_refresh_token',
};

export const getTokens = () => ({
  accessToken: localStorage.getItem(STORAGE_KEYS.accessToken),
  refreshToken: localStorage.getItem(STORAGE_KEYS.refreshToken),
});

export const setTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
  else localStorage.removeItem(STORAGE_KEYS.accessToken);

  if (refreshToken) localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
  else localStorage.removeItem(STORAGE_KEYS.refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem(STORAGE_KEYS.accessToken);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
};

const parseResponse = async (res) => {
  let payload = null;
  try {
    payload = await res.json();
  } catch (_) {
    // ignore parse errors for empty responses
  }

  if (!res.ok || payload?.success === false) {
    const message = payload?.error?.message || payload?.message || res.statusText || 'Request failed';
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  return payload?.data ?? payload;
};

const refreshAccessToken = async () => {
  const { refreshToken } = getTokens();
  if (!refreshToken) throw new Error('No refresh token available');

  const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await parseResponse(res);
  setTokens({ accessToken: data.accessToken, refreshToken });
  return data.accessToken;
};

export async function request(path, { method = 'GET', body, headers = {}, auth = true } = {}) {
  const tokens = getTokens();

  const execute = async (accessTokenOverride) => {
    const finalHeaders = { ...headers };
    let finalBody = body;

    if (body instanceof FormData) {
      // Let the browser set Content-Type for multipart
    } else if (body !== undefined) {
      finalHeaders['Content-Type'] = 'application/json';
      finalBody = JSON.stringify(body);
    }

    if (auth && (accessTokenOverride || tokens.accessToken)) {
      finalHeaders.Authorization = `Bearer ${accessTokenOverride || tokens.accessToken}`;
    }

    return fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: finalBody,
    });
  };

  let response = await execute();

  if (response.status === 401 && auth && tokens.refreshToken) {
    try {
      const newAccess = await refreshAccessToken();
      response = await execute(newAccess);
    } catch (err) {
      clearTokens();
      throw err;
    }
  }

  return parseResponse(response);
}

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  del: (path, options) => request(path, { ...options, method: 'DELETE' }),
};

export { API_BASE_URL };
