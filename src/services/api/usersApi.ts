import { Method } from './apiMethods';
import apiClient from './client';

const Users = 'users';
const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export const registrationApi = async (data: unknown) =>
  Method.POST(`${Users}/Registration`, apiClient, data, headers);

export const loginApi = async (data: unknown) =>
  Method.POST(`${Users}/Login`, apiClient, data, headers);
