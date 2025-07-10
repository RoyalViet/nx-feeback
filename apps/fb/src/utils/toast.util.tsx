import React from 'react';
import { Id, toast, ToastOptions } from 'react-toastify';

import { cn } from '@/lib/utils';

type ToastMessage = string | { title: string; description?: string };

interface ToastContentProps {
  title: string;
  description?: string;
}

const ToastContent: React.FC<ToastContentProps> = ({ title, description }) => (
  <div className={cn('flex flex-1 flex-col gap-1', { 'px-1': !!description })}>
    <div className={cn('text-sm', { 'font-medium': description })}>{title}</div>
    {description && <div className="text-sm">{description}</div>}
  </div>
);

const toastTypes = {
  error: { type: 'error', autoClose: 2000 },
  success: { type: 'success', autoClose: 2000 },
  warning: { type: 'warning', autoClose: 2000 },
  info: { type: 'info', autoClose: 2000 },
} as const;

class ToastInstance {
  toast: Id;
  type: keyof typeof toastTypes;

  constructor(type: keyof typeof toastTypes) {
    this.type = type;
  }

  show = (message: ToastMessage, duration?: number) => {
    const options = {
      ...toastTypes[this.type],
      className: cn('custom-toast', {
        'has-description': typeof message !== 'string' && !!message.description,
      }),
      autoClose: duration || toastTypes[this.type].autoClose,
    } as ToastOptions;

    const content = (
      <ToastContent
        title={typeof message === 'string' ? message : message.title}
        description={typeof message === 'string' ? undefined : message.description}
      />
    );

    if (!toast.isActive(this.toast)) {
      this.toast = toast(content, options);
    } else {
      toast.update(this.toast, {
        render: content,
        autoClose: options.autoClose,
        closeButton: true,
        className: options.className,
      });
    }
  };
}

const toastError = new ToastInstance('error').show;
const toastSuccess = new ToastInstance('success').show;
const toastWarning = new ToastInstance('warning').show;
const toastInfo = new ToastInstance('info').show;

export { toastError, toastSuccess, toastWarning, toastInfo };
