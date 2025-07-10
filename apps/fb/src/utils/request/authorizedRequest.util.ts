import { AxiosError } from 'axios';

import environment from '@/environments/environment';

import Request from './request.util';

const authManager = {
  token: '__fake_token__',
  refreshToken: '__fake_refresh_token__',
  login: (token: string, refreshToken: string) => {
    authManager.token = token;
    authManager.refreshToken = refreshToken;
  },
  logout: () => {
    //
  },
};

const authorizedRequest = new Request();

interface IRefreshTokenResponse {
  access_token: string;
  expires_in: number;
}

authorizedRequest.api.interceptors.request.use(async request => {
  const originalRequest = request;
  if (!originalRequest.headers.Device && typeof window !== 'undefined') {
    const device = '__fake_device__';
    authorizedRequest.setDeviceInfo(device);
    originalRequest.headers.Device = device;
    return originalRequest;
  } else {
    return request;
  }
});

authorizedRequest.api.interceptors.request.use(async request => {
  const originalRequest = request;
  if (authManager.token && !originalRequest.headers.Authorization) {
    authorizedRequest.setToken(authManager.token);
    originalRequest.headers.Authorization = `Bearer ${authManager.token}`;
    return originalRequest;
  } else {
    return request;
  }
});

authorizedRequest.api.interceptors.response.use(
  response => {
    return response;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (error: AxiosError<any>) => {
    return Promise.reject(error);
  }
);

export function refreshTokenApi(body: { refresh_token: string }) {
  return authorizedRequest.post<IRefreshTokenResponse>(
    `${environment.API_SERVICES.FB}/token`,
    body
  );
}

let isRefreshing = false;
let failureQueue: Array<{
  resolve: (value?: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processingQueue = (error: unknown, token?: string) => {
  failureQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failureQueue = [];
};

authorizedRequest.api.interceptors.response.use(
  response => {
    return response;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (error: AxiosError<any>) => {
    const originalConfig = error.config;
    if (error.response?.status === 401 && error.response?.data?.statusCode === 401) {
      if (
        !originalConfig?.url?.includes(`${environment.API_SERVICES.FB}/user/logout`) &&
        !originalConfig?.url?.includes(`${environment.API_SERVICES.FB}/token`)
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failureQueue.push({ resolve, reject });
          })
            .then(token => {
              const headers = {
                ...(typeof originalConfig?.headers === 'object' ? originalConfig.headers : {}),
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              };
              return authorizedRequest.api({
                ...originalConfig,
                headers,
              });
            })
            .catch(error => {
              return Promise.reject(error);
            });
        }
        isRefreshing = true;
        return new Promise((resolve, reject) => {
          refreshTokenApi({
            refresh_token: authManager.refreshToken as string,
          })
            .then(response => {
              authManager.login(response.access_token, authManager.refreshToken as string);
              processingQueue(null, response.access_token);
              resolve(
                authorizedRequest.api({
                  ...originalConfig,
                  headers: {
                    ...originalConfig?.headers,
                    Authorization: response.access_token
                      ? `Bearer ${response.access_token}`
                      : undefined,
                  },
                })
              );
            })
            .catch(error => {
              authManager.logout();
              processingQueue(error, undefined);
              reject(error);
            })
            .finally(() => {
              isRefreshing = false;
            });
        });
      } else {
        authManager.logout();
      }
    } else if (error.response?.status === 401 && error.response?.data?.statusCode !== 401) {
      authManager.logout();
      return Promise.reject(error);
    } else {
      return Promise.reject(error);
    }
  }
);

export default authorizedRequest;
