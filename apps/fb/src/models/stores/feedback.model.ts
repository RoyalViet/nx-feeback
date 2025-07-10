import { Expose, Transform } from 'class-transformer';

export interface FeedbackFilters {
  search?: string;
  sortBy?: 'newest' | 'oldest';
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  message?: string;
}
export class Feedback {
  @Expose({ name: 'id' })
  @Transform(({ value }) => String(value))
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  message: string;

  @Expose()
  @Transform(({ value }) => new Date(value))
  submittedAt: Date;

  @Expose()
  isAnonymous?: boolean;

  @Expose()
  status: 'pending' | 'replied' | 'draft';

  @Expose()
  priority: 'low' | 'medium' | 'high' | 'urgent';

  @Expose()
  category: string;

  @Expose()
  tags: string[];

  @Expose()
  reply?: {
    message: string;
    repliedAt: Date;
    repliedBy: string;
    status: 'draft' | 'published';
  };

  @Expose()
  sentiment?: 'positive' | 'negative' | 'neutral';

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  readAt?: Date;

  @Expose()
  upvotes: number;

  @Expose()
  downvotes: number;
}

export interface FeedbackResponse {
  feedback: Feedback[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface FeedbackSubmission {
  name: string;
  email: string;
  message: string;
}

export interface IFeedbackStoreModel {
  feedbackList: {
    isLoading: boolean;
    data: Array<Feedback>;
    page: number;
    size: number;
    totalItem: number;
    totalPage: number;
  };
}
