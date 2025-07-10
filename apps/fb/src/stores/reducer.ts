import { combineReducers, ReducersMapObject } from 'redux';
import { ActionType } from 'typesafe-actions';

import { IStoreState } from '@/models/stores';

import feedbackReducer from './feedback/feedback.reducer';

const rootReducer: ReducersMapObject<
  IStoreState,
  ActionType<typeof import('../stores/action').default>
> = {
  feedback: feedbackReducer,
};

export default combineReducers(rootReducer);
