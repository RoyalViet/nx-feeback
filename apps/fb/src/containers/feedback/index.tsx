import React from 'react';

import { FeedbackList } from '@/components/feedback/FeedbackList';

const Feedback = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-foreground text-3xl font-bold">Community Feedback</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Discover what our community is saying. Read feedback, suggestions, and insights from
            users who help shape our products.
          </p>
        </div>

        <FeedbackList />
      </div>
    </main>
  );
};

export default Feedback;
