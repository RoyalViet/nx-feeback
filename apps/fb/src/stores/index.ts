import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import environment from '@/environments/environment';

import rootReducer from './reducer';
import rootSaga from './saga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ thunk: false, serializableCheck: false }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production' || environment.APP_ENV === 'production',
});

sagaMiddleware.run(rootSaga);

export type TAppStore = typeof store;
export type IRootState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;
