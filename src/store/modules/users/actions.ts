import { ApIConstant } from './actionTypes';

export const createUserAccountRequestAction = (payload: unknown) => ({
  type: ApIConstant.API_CREATE_USER_ACCOUNT_LOAD,
  payload,
});
