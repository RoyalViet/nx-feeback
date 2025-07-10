import { FC, ReactNode } from 'react';
import NextLink from 'next/link';
import { UrlObject } from 'url';

import { cn } from '@/lib/utils';

export interface ILinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'to'> {
  className?: string;
  title?: string;
  target?: string;
  children?: ReactNode;
  isOpenNewTab?: boolean;
  href?: string | UrlObject;
  to?: string | UrlObject;
}

const Link: FC<ILinkProps> = ({
  children,
  title,
  target,
  className,
  isOpenNewTab,
  href,
  to,
  ...props
}) => {
  const linkUrl = href || to || '';
  const shouldOpenNewTab =
    isOpenNewTab ?? (typeof linkUrl === 'string' && linkUrl.startsWith('https://'));
  return (
    <NextLink
      href={linkUrl}
      className={cn(className)}
      title={title}
      target={target ? target : shouldOpenNewTab ? '_blank' : undefined}
      rel={shouldOpenNewTab ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </NextLink>
  );
};

export default Link;
