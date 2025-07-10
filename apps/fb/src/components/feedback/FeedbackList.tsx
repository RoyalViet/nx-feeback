// Professional feedback listing component with pagination

import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, MessageSquare, Search, SortAsc } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PAGE_SIZE_OPTIONS } from '@/constants/common.constant';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { Feedback, FeedbackFilters } from '@/models/stores/feedback.model';
import { getFeedbackActions } from '@/stores/feedback/feedback.action';
import { toastSuccess } from '@/utils/toast.util';

import { FeedbackCard } from './FeedbackCard';
import { FeedbackDetailDialog } from './FeedbackDetailDialog';
import { FeedbackListSkeleton } from './FeedbackListSkeleton';

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function FeedbackList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<FeedbackFilters>({
    search: '',
    sortBy: 'newest',
  });
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const feedbackList = useAppSelector(state => state.feedback.feedbackList);
  const { isLoading, data, totalItem, totalPage } = feedbackList;

  const dispatch = useAppDispatch();

  const debouncedSearch = useDebounce(searchInput, 300);
  useEffect(() => {
    setFilters(prev => ({ ...prev, search: debouncedSearch }));
    setCurrentPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    dispatch(
      getFeedbackActions.request({
        page: currentPage,
        size: pageSize,
        search: filters.search || '',
        sortBy: filters.sortBy || 'newest',
      })
    );
  }, [currentPage, pageSize, filters, dispatch]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  // Handle sort change
  const handleSortChange = (sortBy: 'newest' | 'oldest') => {
    setFilters(prev => ({ ...prev, sortBy }));
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(parseInt(newPageSize));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFeedbackClick = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setDialogOpen(true);
  };

  const handleReply = (feedbackId: string, reply: string, isDraft: boolean) => {
    // TODO: Implement reply logic with API
    toastSuccess('Pending for approval');
  };

  const handleVote = (feedbackId: string, type: 'up' | 'down') => {
    // TODO: Implement voting logic with API
    toastSuccess('Pending for approval');
  };

  const generatePaginationButtons = () => {
    if (!totalPage) return [];

    const buttons = [];
    const maxVisiblePages = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const end = Math.min(totalPage, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      buttons.push(i);
    }

    return buttons;
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Community Feedback
              </CardTitle>
              <CardDescription>{totalItem || 0} feedback submissions</CardDescription>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
                <Input
                  placeholder="Search feedback..."
                  value={searchInput || ''}
                  onChange={e => handleSearchChange(e.target.value)}
                  className="w-full pl-10 sm:w-64"
                />
              </div>

              <Select value={filters.sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full sm:w-40">
                  <SortAsc className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>

              <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                <SelectTrigger className="w-full sm:w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map(size => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {isLoading ? (
        <FeedbackListSkeleton count={pageSize} />
      ) : (
        <div className="space-y-4">
          {data?.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <h3 className="mb-2 text-lg font-semibold">No Feedback Found</h3>
                <p className="text-muted-foreground">
                  {filters.search
                    ? `No feedback matches "${filters.search}"`
                    : 'Be the first to share your feedback!'}
                </p>
              </CardContent>
            </Card>
          ) : (
            data?.map(feedback => (
              <FeedbackCard key={feedback.id} feedback={feedback} onClick={handleFeedbackClick} />
            ))
          )}
        </div>
      )}

      {totalPage && totalPage > 1 ? (
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="text-muted-foreground text-sm">
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, totalItem)} of {totalItem} results
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex gap-1">
                  {generatePaginationButtons().map(page => (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPage}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <FeedbackDetailDialog
        feedback={selectedFeedback}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onReply={handleReply}
        onVote={handleVote}
      />
    </div>
  );
}
