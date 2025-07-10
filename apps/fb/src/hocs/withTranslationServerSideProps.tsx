import { GetServerSidePropsContext } from 'next';

import { initI18n } from '@/utils/translation/translation.util';

export async function withTranslationServerSideProps({ locale }: GetServerSidePropsContext) {
  try {
    const translationProps = await initI18n(locale || 'en', 'common');

    return {
      props: {
        ...translationProps,
      },
    };
  } catch (error) {
    console.error('Failed to fetch API translations:', error);
    return {
      props: {},
    };
  }
}
