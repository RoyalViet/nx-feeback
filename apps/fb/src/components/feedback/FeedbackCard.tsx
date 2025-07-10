// Individual feedback card component

import { formatDistanceToNow } from 'date-fns';
import { ArrowDown, ArrowUp, Clock, Mail, MessageSquare, Tag, User } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Feedback } from '@/models/stores/feedback.model';

interface FeedbackCardProps {
  feedback: Feedback;
  onClick: (feedback: Feedback) => void;
}

export function FeedbackCard({ feedback, onClick }: FeedbackCardProps) {
  const displayName = feedback.isAnonymous ? 'Anonymous' : feedback.name;
  const timeAgo = formatDistanceToNow(new Date(feedback.submittedAt), { addSuffix: true });

  // Truncate message for summary
  const summaryMessage =
    feedback.message.length > 120 ? feedback.message.substring(0, 120) + '...' : feedback.message;

  const getStatusBadge = () => {
    switch (feedback.status) {
      case 'replied':
        return (
          <Badge variant="default" className="bg-green-500">
            Replied
          </Badge>
        );
      case 'draft':
        return <Badge variant="secondary">Draft Reply</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const getPriorityBadge = () => {
    const variants = {
      urgent: 'destructive',
      high: 'default',
      medium: 'secondary',
      low: 'outline',
    } as const;

    return <Badge variant={variants[feedback.priority]}>{feedback.priority}</Badge>;
  };

  const getSentimentColor = () => {
    switch (feedback.sentiment) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-md"
      onClick={() => onClick(feedback)}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-full p-2">
                <User className="text-primary h-4 w-4" />
              </div>
              <div>
                <h3 className="text-foreground font-medium">{displayName}</h3>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Mail className="h-3 w-3" />
                  <span>{feedback.email}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {feedback.isAnonymous && (
                <Badge variant="secondary" className="text-xs">
                  Anonymous
                </Badge>
              )}
              {getStatusBadge()}
              {getPriorityBadge()}
              <div className="text-muted-foreground flex items-center gap-1 text-sm">
                <Clock className="h-3 w-3" />
                <span>{timeAgo}</span>
              </div>
            </div>
          </div>

          {/* Tags and Category */}
          <div className="flex items-center gap-2 pl-11 text-xs">
            <Tag className="text-muted-foreground h-3 w-3" />
            <span className="text-muted-foreground">{feedback.category}</span>
            {feedback.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Summary Message */}
          <div className="pl-11">
            <p className={`text-foreground leading-relaxed ${getSentimentColor()}`}>
              {summaryMessage}
            </p>
          </div>

          {/* Engagement Stats */}
          <div className="flex items-center justify-between pl-11">
            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <ArrowUp className="h-3 w-3" />
                <span>{feedback.upvotes}</span>
              </div>
              <div className="flex items-center gap-1">
                <ArrowDown className="h-3 w-3" />
                <span>{feedback.downvotes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>View Details</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
