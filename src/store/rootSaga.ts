import { all } from 'redux-saga/effects';

import { watchProductsSaga } from './modules/products/saga';
import { watchUsersSaga } from './modules/users/saga';

export default function* rootSaga() {
  yield all([watchUsersSaga(), watchProductsSaga()]);
}
