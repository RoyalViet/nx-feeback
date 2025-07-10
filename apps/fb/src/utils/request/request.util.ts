/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, Canceler } from 'axios';
import * as qs from 'query-string';

import environment from '@/environments/environment';

const { CancelToken } = axios;

export const CANCEL = '@@redux-saga/CANCEL_PROMISE';

export interface IPromiseWithCancel<R> extends Promise<R> {
  [CANCEL]?: () => void;
}

interface IOptions {
  rawResponse?: boolean;
}

export default class Request {
  api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      withCredentials: false,
      timeout: 60000,
      baseURL: environment.API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      paramsSerializer: params => {
        return qs.default.stringify(params, { arrayFormat: 'comma' });
      },
    });
  }

  setToken(token?: string) {
    this.api.defaults.headers.common = {
      ...this.api.defaults.headers.common,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  setDeviceInfo(deviceInfo: string) {
    this.api.defaults.headers.common = {
      ...this.api.defaults.headers.common,
      Device: deviceInfo,
    };
  }

  get = <T = any>(url: string, config: AxiosRequestConfig = {}, options?: IOptions) => {
    let cancel: Canceler;

    const newConfig: AxiosRequestConfig = {
      ...config,
      params: {
        ...config.params,
      },
      cancelToken: new CancelToken(c => {
        cancel = c;
      }),
    };

    const request: IPromiseWithCancel<T> = this.api
      .get(url, newConfig)
      .then(response => {
        return options?.rawResponse ? response : response?.data;
      })
      .catch(error => {
        if (typeof window !== 'undefined' && !window?.navigator?.onLine) {
          error = {
            ...error,
            response: {
              data: {
                ...(error?.response?.data || {}),
                error: 'COMMON.INTERNET_CONNECTION_ERROR',
                msg: 'COMMON.INTERNET_CONNECTION_ERROR',
                errors: [{ msg: 'COMMON.INTERNET_CONNECTION_ERROR' }],
              },
            },
          };
        }
        throw error;
      });

    request[CANCEL] = () => cancel();

    return request;
  };

  post = <T = any>(
    url: string,
    body?: any,
    config: AxiosRequestConfig = {},
    options?: IOptions
  ) => {
    let cancel: Canceler;

    const newConfig: AxiosRequestConfig = {
      ...config,
      params: {
        ...config.params,
      },
      cancelToken: new CancelToken(c => {
        cancel = c;
      }),
    };

    const request: IPromiseWithCancel<T> = this.api
      .post(url, body, newConfig)
      .then(response => {
        return options?.rawResponse ? response : response?.data;
      })
      .catch(error => {
        if (typeof window !== 'undefined' && !window?.navigator?.onLine) {
          error = {
            ...error,
            response: {
              data: {
                ...(error?.response?.data || {}),
                error: 'COMMON.INTERNET_CONNECTION_ERROR',
                msg: 'COMMON.INTERNET_CONNECTION_ERROR',
                errors: [{ msg: 'COMMON.INTERNET_CONNECTION_ERROR' }],
              },
            },
          };
        }
        throw error;
      });

    request[CANCEL] = () => cancel();

    return request;
  };

  put = <T = any>(url: string, body?: any, config: AxiosRequestConfig = {}, options?: IOptions) => {
    let cancel: Canceler;

    const newConfig: AxiosRequestConfig = {
      ...config,
      params: {
        ...config.params,
      },
      cancelToken: new CancelToken(c => {
        cancel = c;
      }),
    };

    const request: IPromiseWithCancel<T> = this.api
      .put(url, body, newConfig)
      .then(response => {
        return options?.rawResponse ? response : response?.data;
      })
      .catch(error => {
        if (typeof window !== 'undefined' && !window?.navigator?.onLine) {
          error = {
            ...error,
            response: {
              data: {
                ...(error?.response?.data || {}),
                error: 'COMMON.INTERNET_CONNECTION_ERROR',
                msg: 'COMMON.INTERNET_CONNECTION_ERROR',
                errors: [{ msg: 'COMMON.INTERNET_CONNECTION_ERROR' }],
              },
            },
          };
        }
        throw error;
      });

    request[CANCEL] = () => cancel();

    return request;
  };

  patch = <T = any>(
    url: string,
    body?: any,
    config: AxiosRequestConfig = {},
    options?: IOptions
  ) => {
    let cancel: Canceler;

    const newConfig: AxiosRequestConfig = {
      ...config,
      params: {
        ...config.params,
      },
      cancelToken: new CancelToken(c => {
        cancel = c;
      }),
    };

    const request: IPromiseWithCancel<T> = this.api
      .patch(url, body, newConfig)
      .then(response => {
        return options?.rawResponse ? response : response?.data;
      })
      .catch(error => {
        if (typeof window !== 'undefined' && !window?.navigator?.onLine) {
          error = {
            ...error,
            response: {
              data: {
                ...(error?.response?.data || {}),
                error: 'COMMON.INTERNET_CONNECTION_ERROR',
                msg: 'COMMON.INTERNET_CONNECTION_ERROR',
                errors: [{ msg: 'COMMON.INTERNET_CONNECTION_ERROR' }],
              },
            },
          };
        }
        throw error;
      });

    request[CANCEL] = () => cancel();

    return request;
  };

  delete = <T = any>(url: string, config: AxiosRequestConfig = {}, options?: IOptions) => {
    let cancel: Canceler;

    const newConfig: AxiosRequestConfig = {
      ...config,
      params: {
        ...config.params,
      },
      cancelToken: new CancelToken(c => {
        cancel = c;
      }),
    };

    const request: IPromiseWithCancel<T> = this.api
      .delete(url, newConfig)
      .then(response => {
        return options?.rawResponse ? response : response?.data;
      })
      .catch(error => {
        if (typeof window !== 'undefined' && !window?.navigator?.onLine) {
          error = {
            ...error,
            response: {
              data: {
                ...(error?.response?.data || {}),
                error: 'COMMON.INTERNET_CONNECTION_ERROR',
                msg: 'COMMON.INTERNET_CONNECTION_ERROR',
                errors: [{ msg: 'COMMON.INTERNET_CONNECTION_ERROR' }],
              },
            },
          };
        }
        throw error;
      });

    request[CANCEL] = () => cancel();

    return request;
  };
}
