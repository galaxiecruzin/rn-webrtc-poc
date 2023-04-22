import createSagaMiddleware from "redux-saga";
import rootReducer from './reducers/index';
import rootSaga from './sagas/index';

import {
  configureStore,
} from "@reduxjs/toolkit";


let sagaMiddleware = createSagaMiddleware();

const middleware = [sagaMiddleware];

const store = configureStore({
  reducer: rootReducer,
  middleware
});


sagaMiddleware.run(rootSaga);

export default store;

