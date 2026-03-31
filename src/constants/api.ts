// Replace this base URL with your real backend URL when the API is ready.
export const API_BASE_URL = 'https://api.example.com';

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  timeout: 10000,
};

export const API_ENDPOINTS = {
  users: {
    list: '/users',
    detail: (userId: number | string) => `/users/${userId}`,
  },
  products: {
    list: '/products',
    detail: (productId: number | string) => `/products/${productId}`,
  },
};
