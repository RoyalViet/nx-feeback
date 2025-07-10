// Detailed feedback dialog with reply functionality

import { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Clock,
  Edit,
  Eye,
  Mail,
  MessageSquare,
  Save,
  Send,
  Tag,
  User,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Feedback } from '@/models/stores/feedback.model';

interface FeedbackDetailDialogProps {
  feedback: Feedback | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReply: (feedbackId: string, reply: string, isDraft: boolean) => void;
  onVote: (feedbackId: string, type: 'up' | 'down') => void;
}

export function FeedbackDetailDialog({
  feedback,
  open,
  onOpenChange,
  onReply,
  onVote,
}: FeedbackDetailDialogProps) {
  const [replyText, setReplyText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  if (!feedback) return null;

  const displayName = feedback.isAnonymous ? 'Anonymous' : feedback.name;
  const timeAgo = formatDistanceToNow(new Date(feedback.submittedAt), { addSuffix: true });

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

  const handleSaveDraft = () => {
    if (replyText.trim()) {
      onReply(feedback.id, replyText, true);
      setIsEditing(false);
    }
  };

  const handlePublishReply = () => {
    if (replyText.trim()) {
      onReply(feedback.id, replyText, false);
      setIsEditing(false);
      setReplyText('');
    }
  };

  const handleEditReply = () => {
    setReplyText(feedback.reply?.message || '');
    setIsEditing(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Feedback Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <User className="text-primary h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-foreground text-lg font-semibold">{displayName}</h3>
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4" />
                      <span>{feedback.email}</span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(feedback.submittedAt), 'PPP p')}</span>
                      <span>({timeAgo})</span>
                    </div>
                    {feedback.readAt && (
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Eye className="h-4 w-4" />
                        <span>
                          Read {formatDistanceToNow(new Date(feedback.readAt), { addSuffix: true })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {feedback.isAnonymous && <Badge variant="secondary">Anonymous</Badge>}
                  {getStatusBadge()}
                  {getPriorityBadge()}
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Tag className="text-muted-foreground h-4 w-4" />
                  <span className="font-medium">Category:</span>
                  <Badge variant="outline">{feedback.category}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">Tags:</span>
                  {feedback.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Feedback Message</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-foreground whitespace-pre-wrap leading-relaxed ${getSentimentColor()}`}
              >
                {feedback.message}
              </p>
            </CardContent>
          </Card>

          {/* <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onVote(feedback.id, 'up')}
                    className="flex items-center gap-2"
                  >
                    <ArrowUp className="h-4 w-4" />
                    <span>{feedback.upvotes}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onVote(feedback.id, 'down')}
                    className="flex items-center gap-2"
                  >
                    <ArrowDown className="h-4 w-4" />
                    <span>{feedback.downvotes}</span>
                  </Button>
                  {feedback.sentiment && (
                    <Badge variant="outline" className={getSentimentColor()}>
                      {feedback.sentiment}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card> */}

          {feedback.reply && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span>Reply</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={feedback.reply.status === 'published' ? 'default' : 'secondary'}
                    >
                      {feedback.reply.status}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={handleEditReply}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-3 whitespace-pre-wrap leading-relaxed">
                  {feedback.reply.message}
                </p>
                <div className="text-muted-foreground text-sm">
                  By {feedback.reply.repliedBy} •{' '}
                  {format(new Date(feedback.reply.repliedAt), 'PPP p')}
                </div>
              </CardContent>
            </Card>
          )}

          {(isEditing || !feedback.reply) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {feedback.reply ? 'Edit Reply' : 'Write Reply'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Write your reply..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  className="min-h-[120px]"
                />
                <div className="flex items-center gap-2">
                  <Button onClick={handleSaveDraft} variant="outline" disabled={!replyText.trim()}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </Button>
                  <Button onClick={handlePublishReply} disabled={!replyText.trim()}>
                    <Send className="mr-2 h-4 w-4" />
                    Publish Reply
                  </Button>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsEditing(false);
                        setReplyText('');
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
