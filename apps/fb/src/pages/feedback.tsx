import React from 'react';

import Feedback from '@/containers/feedback';
import { renderCommonLayout } from '@/layouts/common';

const Page = () => {
  return <Feedback />;
};

Page.renderLayout = renderCommonLayout;

export default Page;
