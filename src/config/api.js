// Основной URL API
export const API_BASE_URL = "http://localhost:3002";

// Если нужно различать окружения (dev/prod)
export const API_CONFIG = {
  development: {
    baseURL: "http://localhost:3002",
  },
  production: {
    baseURL: "https://api.yourapp.com", // Замени на реальный URL
  },
};

// Получить актуальный URL в зависимости от окружения
export const getApiUrl = () => {
  const isDev = import.meta.env.MODE === "development";
  return isDev ? API_CONFIG.development.baseURL : API_CONFIG.production.baseURL;
};

// Времауты и другие опции
export const API_OPTIONS = {
  timeout: 10000, // 10 секунд
  retries: 3,
};
