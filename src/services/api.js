import { API_BASE_URL } from "../config/api";

async function customFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }
    const errorMessage =
      typeof errorData === "string"
        ? errorData
        : errorData.message || "Something went wrong";
    throw new Error(errorMessage);
  }
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const apiGet = (endpoint) => customFetch(endpoint);

export const apiPost = (endpoint, body) => {
  return customFetch(endpoint, {
    method: "POST",
    body,
  });
};

export const apiPut = (endpoint, body) => {
  return customFetch(endpoint, {
    method: "PUT",
    body,
  });
};

export const apiPatch = (endpoint, body) => {
  return customFetch(endpoint, {
    method: "PATCH",
    body,
  });
};

export const apiDelete = (endpoint) => {
  return customFetch(endpoint, {
    method: "DELETE",
  });
};

export default {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  patch: apiPatch,
  delete: apiDelete,
};
