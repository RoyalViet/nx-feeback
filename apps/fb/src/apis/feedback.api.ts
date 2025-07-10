import { ApiResponse, FeedbackFilters, FeedbackResponse } from '@/models/stores/feedback.model';
import { feedbackService } from '@/services/feedbackService';

export function getFeedbackApi(
  page: number,
  pageSize: number,
  filters: FeedbackFilters
): Promise<ApiResponse<FeedbackResponse>> {
  return new Promise((resolve, reject) => {
    feedbackService
      .getFeedback(page, pageSize, filters)
      .then(res => {
        setTimeout(() => {
          resolve(res);
        }, 1000);
      })
      .catch(reject);
  });
}
