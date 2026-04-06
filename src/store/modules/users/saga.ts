import type { SagaIterator } from 'redux-saga';
import { call, takeLatest } from 'redux-saga/effects';

import { forgotPasswordApi, loginApi, registrationApi, resetPasswordApi } from '../../../services/api/usersApi';
import { handleApiCalls } from '../handleApiCalls';

import { ApIConstant } from './actionTypes';

interface UserAccountAction {
  type: string;
  payload: {
    requestData?: unknown;
    key?: string;
  };
}



export function* createUserAccountSaga(
  action: UserAccountAction,
): SagaIterator {
  yield call(
    handleApiCalls,
    registrationApi,
    action.payload ?? {},
    ApIConstant.API_CREATE_USER_ACCOUNT_SUCCESS,
    ApIConstant.API_CREATE_USER_ACCOUNT_ERROR,
  );
}

export function* loginUserAccountSaga(
  action: UserAccountAction,
): SagaIterator {
  yield call(
    handleApiCalls,
    loginApi,
    action.payload ?? {},
    ApIConstant.API_LOGIN_SUCCESS,
    ApIConstant.API_LOGIN_ERROR,
  );
}

export function* forgotPasswordSaga(
  action: UserAccountAction,
): SagaIterator {
  yield call(
    handleApiCalls,
    forgotPasswordApi,
    action.payload ?? {},
    ApIConstant.API_FORGOT_ACCOUNT_SUCCESS,
    ApIConstant.API_FORGOT_ACCOUNT_ERROR,
  );
}

export function* resetPasswordSaga(
  action: UserAccountAction,
): SagaIterator {
  yield call(
    handleApiCalls,
    resetPasswordApi,
    action.payload ?? {},
    ApIConstant.API_RESET_ACCOUNT_SUCCESS,
    ApIConstant.API_RESET_ACCOUNT_ERROR,
  );
}


export function* watchUsersSaga(): SagaIterator {
  yield takeLatest(
    ApIConstant.API_CREATE_USER_ACCOUNT_LOAD,
    createUserAccountSaga,
  );
  yield takeLatest(
    ApIConstant.API_LOGIN_LOAD,
    loginUserAccountSaga,
  );
  yield takeLatest(
    ApIConstant.API_FORGOT_ACCOUNT_LOAD,
    forgotPasswordSaga,
  );
  yield takeLatest(
    ApIConstant.API_RESET_ACCOUNT_LOAD,
    resetPasswordSaga,
  );
}
