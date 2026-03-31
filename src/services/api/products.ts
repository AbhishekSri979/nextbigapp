import type { AxiosResponse } from 'axios';

import { API_ENDPOINTS } from '../../constants/api';
import type { Product } from '../../types/models';

import apiClient from './client';

export const productsApi = {
  getProducts(): Promise<AxiosResponse<Product[]>> {
    return apiClient.get<Product[]>(API_ENDPOINTS.products.list);
  },

  getProductById(productId: number | string): Promise<AxiosResponse<Product>> {
    return apiClient.get<Product>(API_ENDPOINTS.products.detail(productId));
  },
};

export default productsApi;
