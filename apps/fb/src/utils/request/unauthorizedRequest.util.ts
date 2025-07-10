import { AxiosError } from 'axios';

import Request from './request.util';

const unauthorizedRequest = new Request();

unauthorizedRequest.api.interceptors.request.use(async request => {
  const originalRequest = request;
  if (!originalRequest.headers.Device && typeof window !== 'undefined') {
    const device = '__fake_device__';
    unauthorizedRequest.setDeviceInfo(device);
    originalRequest.headers.Device = device;
    return originalRequest;
  } else {
    return request;
  }
});

unauthorizedRequest.api.interceptors.response.use(
  response => {
    return response;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (error: AxiosError<any>) => {
    return Promise.reject(error);
  }
);

export default unauthorizedRequest;
