import { call, put, takeLatest } from '@redux-saga/core/effects';

import { getFeedbackApi } from '@/apis/feedback.api';
import { Feedback } from '@/models/stores/feedback.model';
import { plainToClass } from '@/utils/class-transformer.util';
import { getMessageFromError } from '@/utils/error.util';
import { toastError } from '@/utils/toast.util';

import * as actions from './feedback.action';

function* handleGetFeedback({ payload }: ReturnType<typeof actions.getFeedbackActions.request>) {
  try {
    const response: Await<ReturnType<typeof getFeedbackApi>> = yield call(
      getFeedbackApi,
      payload.page,
      payload.size,
      {
        search: payload.search,
        sortBy: payload.sortBy as 'newest' | 'oldest',
      }
    );

    yield put(
      actions.getFeedbackActions.success({
        data: plainToClass(Feedback, response?.data?.feedback || []),
        page: Number(response?.data?.pagination?.page) || 1,
        size: Number(response?.data?.pagination?.pageSize) || 10,
        totalItem: Number(response?.data?.pagination?.total) || 0,
        totalPage: Number(response?.data?.pagination?.totalPages) || 0,
      })
    );
  } catch (e) {
    toastError(getMessageFromError(e as any));
    yield put(actions.getFeedbackActions.failure());
  }
}

export default function* feedbackSaga() {
  yield takeLatest(actions.getFeedbackActions.request, handleGetFeedback);
}
