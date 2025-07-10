import { produce } from 'immer';
import { createReducer } from 'typesafe-actions';

import { IFeedbackStoreModel } from '@/models/stores/feedback.model';

import * as actions from './feedback.action';

const INITIAL_STATE: IFeedbackStoreModel = {
  feedbackList: {
    isLoading: false,
    data: [],
    page: 1,
    size: 10,
    totalItem: 0,
    totalPage: 0,
  },
};

const feedbackReducer = createReducer(INITIAL_STATE)
  .handleAction(actions.getFeedbackActions.request, state =>
    produce(state, draft => {
      draft.feedbackList.isLoading = true;
    })
  )
  .handleAction(actions.getFeedbackActions.success, (state, { payload }) =>
    produce(state, draft => {
      draft.feedbackList.isLoading = false;
      draft.feedbackList.data = payload.data;
      draft.feedbackList.page = payload.page;
      draft.feedbackList.size = payload.size;
      draft.feedbackList.totalItem = payload.totalItem;
      draft.feedbackList.totalPage = payload.totalPage;
    })
  )
  .handleAction(actions.getFeedbackActions.failure, state =>
    produce(state, draft => {
      draft.feedbackList.isLoading = false;
    })
  );

export default feedbackReducer;
