import { all } from 'redux-saga/effects';
import heroesSaga from './heroesSaga';

export default function* rootSaga() {
  yield all([
    heroesSaga(),
  ]);
}
