import { all, fork } from '@redux-saga/core/effects';

import feedbackSaga from './feedback/feedback.saga';

export default function* rootSaga() {
  try {
    yield all([fork(feedbackSaga)]);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
}
