import { useState } from 'react';

import { FeedbackSubmission } from '@/models/stores/feedback.model';
import { feedbackService } from '@/services/feedbackService';
import { toastError, toastSuccess } from '@/utils/toast.util';

export function useSubmitFeedback() {
  const [isPending, setIsPending] = useState(false);

  async function submit(submission: FeedbackSubmission) {
    setIsPending(true);
    try {
      const response = await feedbackService.submitFeedback(submission);
      if (response.success) {
        toastSuccess({
          title: 'Success!',
          description: 'Your feedback has been submitted successfully.',
        });
      } else {
        toastError({
          title: 'Error',
          description: response.message || 'Failed to submit feedback. Please try again.',
        });
      }
      return response;
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      toastError({
        title: 'Error',
        description: 'Network error. Please check your connection and try again.',
      });
      // throw error;
    } finally {
      setIsPending(false);
    }
  }

  return { submit, isPending };
}
