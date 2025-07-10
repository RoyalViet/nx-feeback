// Validation utilities for forms
// Reusable and scalable validation functions

import { FeedbackSubmission, ValidationErrors } from '@/models/stores/feedback.model';

// Email validation regex (RFC 5322 compliant)
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Constants for validation rules
export const VALIDATION_RULES = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  MESSAGE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 500,
  },
} as const;

// Individual field validators
export const validators = {
  name: (value: string): string | undefined => {
    // if (!value || value.trim().length === 0) {
    //   return 'Name is required';
    // }

    // if (value.trim().length < VALIDATION_RULES.NAME.MIN_LENGTH) {
    //   return `Name must be at least ${VALIDATION_RULES.NAME.MIN_LENGTH} characters`;
    // }

    // if (value.length > VALIDATION_RULES.NAME.MAX_LENGTH) {
    //   return `Name must not exceed ${VALIDATION_RULES.NAME.MAX_LENGTH} characters`;
    // }

    return undefined;
  },

  email: (value: string): string | undefined => {
    if (!value || value.trim().length === 0) {
      return 'Email is required';
    }

    if (!EMAIL_REGEX.test(value)) {
      return 'Please enter a valid email address';
    }

    return undefined;
  },

  message: (value: string): string | undefined => {
    if (!value || value.trim().length === 0) {
      return 'Feedback message is required';
    }

    if (value.trim().length < VALIDATION_RULES.MESSAGE.MIN_LENGTH) {
      return `Message must be at least ${VALIDATION_RULES.MESSAGE.MIN_LENGTH} characters`;
    }

    if (value.length > VALIDATION_RULES.MESSAGE.MAX_LENGTH) {
      return `Message must not exceed ${VALIDATION_RULES.MESSAGE.MAX_LENGTH} characters`;
    }

    return undefined;
  },
};

// Validate entire form
export function validateFeedbackForm(values: FeedbackSubmission): ValidationErrors {
  return {
    name: validators.name(values.name),
    email: validators.email(values.email),
    message: validators.message(values.message),
  };
}

// Check if form has any errors
export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.values(errors).some(error => error !== undefined);
}

// Clean and sanitize input values
export function sanitizeInput(value: string): string {
  return value.trim();
}

// Format character count for display
export function formatCharacterCount(current: number, max: number): string {
  return `${current}/${max}`;
}

// Get character count color based on usage
export function getCharacterCountVariant(
  current: number,
  max: number
): 'default' | 'warning' | 'destructive' {
  const percentage = (current / max) * 100;

  if (percentage >= 100) return 'destructive';
  if (percentage >= 80) return 'warning';
  return 'default';
}

// Real-time validation debouncer (for better UX)
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
