import type { AxiosResponse } from 'axios';

import { API_ENDPOINTS } from '../../constants/api';
import type { User } from '../../types/models';

import apiClient from './client';

export const usersApi = {
  getUsers(): Promise<AxiosResponse<User[]>> {
    return apiClient.get<User[]>(API_ENDPOINTS.users.list);
  },

  getUserById(userId: number | string): Promise<AxiosResponse<User>> {
    return apiClient.get<User>(API_ENDPOINTS.users.detail(userId));
  },
};

export default usersApi;
