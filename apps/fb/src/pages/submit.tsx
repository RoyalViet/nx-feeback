import React from 'react';

import FeedbackForm from '@/containers/submit';
import { renderCommonLayout } from '@/layouts/common';
const Page = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-foreground text-3xl font-bold">We Value Your Input</h2>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Your feedback helps us build better products and experiences. Share your thoughts,
            suggestions, or report issues below.
          </p>
        </div>

        <FeedbackForm />
      </div>
    </main>
  );
};

Page.renderLayout = renderCommonLayout;

export default Page;
