export const API_CONFIG = {
  development: {
    baseURL: "http://localhost:3002",
  },
  production: {
    baseURL: "https://lango-4tlk.onrender.com",
  },
};

export const getApiUrl = () => {
  const isDev = import.meta.env.MODE === "development";
  return isDev ? API_CONFIG.development.baseURL : API_CONFIG.production.baseURL;
};
export const API_BASE_URL = getApiUrl();
export const API_OPTIONS = {
  timeout: 10000,
  retries: 3,
};
