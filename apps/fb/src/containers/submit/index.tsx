// Professional feedback submission form with validation

import { useState } from 'react';
import { Mail, MessageSquare, Send, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { FeedbackSubmission, ValidationErrors } from '@/models/stores/feedback.model';
import {
  formatCharacterCount,
  getCharacterCountVariant,
  hasValidationErrors,
  sanitizeInput,
  validateFeedbackForm,
} from '@/utils/validation';

import { useSubmitFeedback } from './helper';

const INITIAL_VALUES: FeedbackSubmission = {
  name: '',
  email: '',
  message: '',
};

const INITIAL_ERRORS: ValidationErrors = {
  name: undefined,
  email: undefined,
  message: undefined,
};

export function FeedbackForm() {
  const [values, setValues] = useState<FeedbackSubmission>(INITIAL_VALUES);
  const [errors, setErrors] = useState<ValidationErrors>(INITIAL_ERRORS);
  const [touched, setTouched] = useState<Record<keyof FeedbackSubmission, boolean>>({
    name: false,
    email: false,
    message: false,
  });

  const submitFeedback = useSubmitFeedback();

  const handleChange = (field: keyof FeedbackSubmission, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setValues(prev => ({ ...prev, [field]: sanitizedValue }));

    if (touched[field]) {
      const newErrors = validateFeedbackForm({ ...values, [field]: sanitizedValue });
      setErrors(prev => ({ ...prev, [field]: newErrors[field] }));
    }
  };

  const handleBlur = (field: keyof FeedbackSubmission) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const newErrors = validateFeedbackForm(values);
    setErrors(prev => ({ ...prev, [field]: newErrors[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ name: true, email: true, message: true });

    const validationErrors = validateFeedbackForm(values);
    setErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) {
      return;
    }

    await submitFeedback.submit(values);

    setValues(INITIAL_VALUES);
    setErrors(INITIAL_ERRORS);
    setTouched({ name: false, email: false, message: false });
  };

  const messageCharCount = values.message.length;
  const messageCharVariant = getCharacterCountVariant(messageCharCount, 500);

  return (
    <Card className="mx-auto w-full max-w-2xl shadow-lg">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold">
          <MessageSquare className="text-primary h-6 w-6" />
          Share Your Feedback
        </CardTitle>
        <CardDescription className="text-base">
          We value your input! Help us improve by sharing your thoughts and suggestions.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4" />
              Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name (or 'Anonymous')"
              value={values.name}
              onChange={e => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              className={cn(
                'transition-colors',
                errors.name && touched.name && 'border-destructive focus:border-destructive'
              )}
              disabled={submitFeedback.isPending}
            />
            {errors.name && touched.name && (
              <p className="text-destructive text-sm">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={values.email}
              onChange={e => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              className={cn(
                'transition-colors',
                errors.email && touched.email && 'border-destructive focus:border-destructive'
              )}
              disabled={submitFeedback.isPending}
            />
            {errors.email && touched.email && (
              <p className="text-destructive text-sm">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="message" className="flex items-center gap-2 text-sm font-medium">
                <MessageSquare className="h-4 w-4" />
                Your Feedback
              </Label>
              <span
                className={cn(
                  'text-xs',
                  messageCharVariant === 'destructive' && 'text-destructive',
                  messageCharVariant === 'warning' && 'text-warning',
                  messageCharVariant === 'default' && 'text-muted-foreground'
                )}
              >
                {formatCharacterCount(messageCharCount, 500)}
              </span>
            </div>
            <Textarea
              id="message"
              placeholder="Tell us what you think! What's working well? What could be improved? Your detailed feedback helps us serve you better."
              value={values.message}
              onChange={e => handleChange('message', e.target.value)}
              onBlur={() => handleBlur('message')}
              className={cn(
                'min-h-32 resize-none transition-colors',
                errors.message && touched.message && 'border-destructive focus:border-destructive'
              )}
              maxLength={500}
              disabled={submitFeedback.isPending}
            />
            {errors.message && touched.message && (
              <p className="text-destructive text-sm">{errors.message}</p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full transition-all duration-200 hover:scale-[1.02]"
            disabled={submitFeedback.isPending}
          >
            {submitFeedback.isPending ? (
              <>
                <div className="border-primary-foreground mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Feedback
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default FeedbackForm;
