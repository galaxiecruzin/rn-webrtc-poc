import { call, put, takeEvery } from 'redux-saga/effects';
// import { heroSlice } from '../reducers/heroes'

function* RegisterHero(action) {
  const { heroActionSuccess } = heroSlice.actions;
  yield put(heroActionSuccess({}));
}

function* LoginHero(action) {
  const { heroActionSuccess } = heroSlice.actions;
  yield put(heroActionSuccess({}));
}

function* HeroIsRegistered() {
  const { heroActionOnboarded } = heroSlice.actions;
  yield put(heroActionOnboarded());
}

function* heroSaga() {
  yield takeEvery("HERO_LOGIN_REQUESTED", LoginHero);
  yield takeEvery("HERO_REGISTRATION_REQUESTED", RegisterHero);
  yield takeEvery("HERO_IS_REGISTERED", HeroIsRegistered);
}

export default heroSaga;
