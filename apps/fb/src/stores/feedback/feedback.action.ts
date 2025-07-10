import { createAsyncAction } from 'typesafe-actions';

import { IGenericDataListResponse } from '@/models/common';
import { Feedback } from '@/models/stores/feedback.model';

export const getFeedbackActions = createAsyncAction(
  'feedback/GET_FEEDBACK',
  'feedback/GET_FEEDBACK_SUCCESS',
  'feedback/GET_FEEDBACK_FAILURE'
)<
  { page: number; size: number; search: string; sortBy: string },
  IGenericDataListResponse<Feedback>,
  void
>();
