import { Method } from './apiMethods';
import apiClient from './client';

const Users = 'users';
const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export const registrationApi = async (data: unknown) =>
  Method.POST(`${Users}/registration`, apiClient, data, headers);

export const loginApi = async (data: unknown) =>
  Method.POST(`${Users}/login`, apiClient, data, headers);

export const forgotPasswordApi = async (data: unknown) =>
  Method.POST(`${Users}/forgot-password`, apiClient, data, headers);

export const resetPasswordApi = async (data: unknown) =>
  Method.POST(`${Users}/reset-password`, apiClient, data, headers);
