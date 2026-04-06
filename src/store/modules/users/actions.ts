import { ApIConstant } from './actionTypes';

export const loginRequestAction = (
  requestData: unknown,
  key?: string,
) => ({
  type: ApIConstant.API_LOGIN_LOAD,
  payload: {
    requestData,
    key,
  },
});

export const createUserAccountRequestAction = (
  requestData: unknown,
  key?: string,
) => ({
  type: ApIConstant.API_CREATE_USER_ACCOUNT_LOAD,
  payload: {
    requestData,
    key,
  },
});

export const forgotAccountRequestAction = (
  requestData: unknown,
  key?: string,
) => ({
  type: ApIConstant.API_FORGOT_ACCOUNT_LOAD,
  payload: {
    requestData,
    key,
  },
});

export const resetAccountRequestAction = (
  requestData: unknown,
  key?: string,
) => ({
  type: ApIConstant.API_RESET_ACCOUNT_LOAD,
  payload: {
    requestData,
    key,
  },
});

export const resetStateAction = () => ({
  type: ApIConstant.API_RESET_STATE,
});
