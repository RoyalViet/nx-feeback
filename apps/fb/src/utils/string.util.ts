import environment from '@/environments/environment';

const getAppFullUrl = (path: string) => {
  return environment.APP_URL + environment.APP_BASENAME + path;
};

export { getAppFullUrl };
