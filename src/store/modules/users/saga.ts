import type { SagaIterator } from 'redux-saga';
import { call, takeLatest } from 'redux-saga/effects';

import { registrationApi } from '../../../services/api/usersApi';
import { handleApiCalls } from '../handleApiCalls';

import { ApIConstant } from './actionTypes';

interface CreateUserAccountAction {
  type: string;
  payload: {
    requestData?: unknown;
    key?: string;
  };
}

export function* createUserAccountSaga(
  action: CreateUserAccountAction,
): SagaIterator {
  yield call(
    handleApiCalls,
    registrationApi,
    action.payload ?? {},
    ApIConstant.API_CREATE_USER_ACCOUNT_SUCCESS,
    ApIConstant.API_CREATE_USER_ACCOUNT_ERROR,
  );
}

export function* watchUsersSaga(): SagaIterator {
  yield takeLatest(
    ApIConstant.API_CREATE_USER_ACCOUNT_LOAD,
    createUserAccountSaga,
  );
}
