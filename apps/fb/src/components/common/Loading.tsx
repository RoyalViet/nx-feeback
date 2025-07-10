import React, { HTMLAttributes } from 'react';

import { ReactComponent as LoadingIcon } from '@/assets/icons/Loading.svg';
import { cn } from '@/lib/utils';

interface Props extends HTMLAttributes<HTMLDivElement> {
  svgProps?: React.SVGProps<SVGSVGElement>;
}

const Loading: React.FC<Props> = ({ svgProps, className, ...props }) => {
  return (
    <div
      className={cn(
        'top-13 absolute left-1/2 flex -translate-x-1/2 transform items-center justify-center',
        className
      )}
      {...props}
    >
      <LoadingIcon {...svgProps} fill={svgProps?.fill || 'var(--gray-300)'} />
    </div>
  );
};

export { LoadingIcon };

export default Loading;
