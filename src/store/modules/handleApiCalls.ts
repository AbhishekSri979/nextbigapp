import type { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { ApIConstant } from './users/actionTypes';

interface ApiPayload {
  requestData?: unknown;
  key?: string;
}

interface ApiResultPayload {
  success?: number;
  data?: unknown;
  message?: string;
}

interface ApiCallResponse {
  result?: unknown;
  status: number;
}

type ApiFunction = (
  requestData?: unknown,
  key?: string,
) => Promise<ApiCallResponse>;

export function* handleApiCalls(
  apiFunction: ApiFunction,
  payload: ApiPayload,
  successAction: string,
  errorAction: string,
): SagaIterator {
  console.log("handleApiCalls called with payload:", payload);

  try {
    const response: ApiCallResponse = yield call(
      apiFunction,
      payload.requestData,
      payload.key,
    );
    const { result, status } = response;
    const resultPayload =
      result && typeof result === 'object'
        ? (result as ApiResultPayload)
        : undefined;
    console.log("API Response:", response);

    yield put({ type: ApIConstant.UPDATE_LODING_STATE, data: false });

    if (status === 1 && resultPayload?.success === 1) {
      yield put({
        type: successAction,
        data: resultPayload.data,
        message: resultPayload.message,
      });
      return;
    }

    yield put({
      type: errorAction,
      data: resultPayload?.message ?? 'Request failed',
    });
  } catch {
    yield put({ type: ApIConstant.UPDATE_LODING_STATE, data: false });
    yield put({
      type: errorAction,
      data: 'Request failed',
    });
  }
}
