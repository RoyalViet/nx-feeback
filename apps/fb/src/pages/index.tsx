import { GetServerSidePropsContext } from 'next';

import { NextPageWithData } from '@/models/common';
import { ROUTER_PATHS } from '@/routers/router.constant';

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    redirect: {
      destination: ROUTER_PATHS.FEEDBACK,
      permanent: false,
    },
  };
};

const Home: NextPageWithData = () => {
  return <div className="m-auto flex w-full justify-center gap-4 p-4">Home</div>;
};

export default Home;
