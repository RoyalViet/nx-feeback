/* eslint-disable @typescript-eslint/no-explicit-any */
import environment from '@/environments/environment';

import { BASE_PATH as BASE_PATH_CONST } from '../../base-path';

export const BASE_PATH = BASE_PATH_CONST;

export const PATHS = {
  ROOT: '/',
  NOT_FOUND: '/404',
  FEEDBACK: '/feedback',
  GUIDE: '/guide',
  SIGN_IN: '/sign-in',

  ACCOUNT: {
    ROOT: '/account/dashboard',
    DASHBOARD: '/account/dashboard',
  },
};

export const BASENAME = environment.APP_BASENAME;

type TPaths = typeof PATHS;

export function routerPathsWithBaseName(paths: TPaths) {
  const temp: TPaths = { ...PATHS };

  Object.keys(paths).forEach((k: string) => {
    switch (typeof (paths as any)[k]) {
      case 'string':
        (temp as any)[k] = BASENAME + (paths as any)[k];
        break;

      case 'object':
        (temp as any)[k] = routerPathsWithBaseName((paths as any)[k]);
        break;

      case 'function':
        (temp as any)[k] = (...args: any) => BASENAME + (paths as any)[k](...args);
        break;

      default:
        break;
    }
  });

  return temp;
}

export const getAllPathValues = (obj: Record<string, any>): string[] => {
  const values: string[] = [];

  const extract = (object: Record<string, any>) => {
    for (const key in object) {
      const value = object[key];
      if (typeof value === 'string') {
        values.push(value);
      } else if (typeof value === 'object' && value !== null) {
        extract(value);
      }
    }
  };

  extract(obj);

  return values;
};

export const ROUTER_PATHS = PATHS;

export const ROUTER_WITH_BASENAME_PATHS = routerPathsWithBaseName(PATHS);
