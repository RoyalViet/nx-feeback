import React from 'react';
import { MessageSquare, TrendingUp } from 'lucide-react';

import { useAppSelector } from '@/hooks/useRedux';

export const HEADER_ID = 'header-id';
const Header = () => {
  const totalItem = useAppSelector(store => store.feedback.feedbackList.totalItem);
  return (
    <header className="bg-gradient-primary border-border/50 border-b shadow-sm" id={HEADER_ID}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-background/10 rounded-lg p-2 backdrop-blur-sm">
              <MessageSquare className="text-primary-foreground h-6 w-6" />
            </div>
            <div>
              <h1 className="text-primary-foreground text-xl font-bold">Feedback Portal</h1>
              <p className="text-primary-foreground/80 text-sm">Your voice matters</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-4">
            <div className="bg-background/10 rounded-lg px-3 py-2 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <TrendingUp className="text-primary-foreground h-4 w-4" />
                <span className="text-primary-foreground text-sm font-medium">
                  {totalItem} feedback received
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
