/* eslint-disable @typescript-eslint/no-explicit-any */
import { isSnakeCase } from '@fb/helper';
import { AxiosError } from 'axios';

import { t } from '@/utils/translation';

export const COMMON_ERROR_KEY = 'FX_JP.COMMON.UNKNOWN_ERROR';

export const getCodeFromError = (error: AxiosError) => {
  try {
    const errorCode = (error?.response?.data as any)?.statusCode;
    return Number(errorCode);
  } catch (error) {
    return 404;
  }
};

export interface IError {
  error_code: number;
  msg: string;
  errors: Array<{
    property: string;
    error_code: number;
    msg: string;
    msg_values?: { [key: string]: string };
  }>;
  timestamp: string;
  path: string;
  statusCode?: number;
}

export const getFlattenErrorCodeFromErrorResponse = (error: AxiosError<IError>) => {
  const errorCode = error?.response?.data?.error_code || error?.response?.data?.statusCode || 0;
  return Number(errorCode);
};

export const getMessageFromError = (error: AxiosError, options?: any) => {
  const commonMessage = t(COMMON_ERROR_KEY) as string;

  try {
    let errorMsgPath: string = (error?.response?.data as Record<string, string>)?.msg;

    if (errorMsgPath && typeof errorMsgPath === 'string') {
      return t(errorMsgPath?.toUpperCase()) || commonMessage;
    }

    errorMsgPath = (error?.response?.data as Record<string, any>)?.error;

    if (errorMsgPath && typeof errorMsgPath === 'string') {
      const arraySnakeCase = errorMsgPath.split('.');
      let checkSnakeCase = true;
      arraySnakeCase.forEach(value => {
        checkSnakeCase = isSnakeCase(value);
        if (!checkSnakeCase) {
          return false;
        }
      });

      if (checkSnakeCase) {
        return t(errorMsgPath?.toUpperCase()) || commonMessage;
      } else {
        return errorMsgPath || commonMessage;
      }
    }

    const errorsMsgObject = (error?.response?.data as Record<string, any>)?.errors;

    if (typeof errorsMsgObject === 'object') {
      const keys = Object.keys(errorsMsgObject);
      if (options.isHighLow) {
        if (keys.length === 0) return commonMessage;
        return t(keys[0], options?.arguments || {}) || commonMessage;
      } else if (keys.length > 0 && errorsMsgObject[keys[0]]?.length > 0) {
        const message = errorsMsgObject[keys[0]][0] || '';
        return t(message?.toUpperCase(), options?.arguments || {}) || commonMessage;
      }
    }

    return (
      (error?.response?.data as Record<string, any>)?.message ||
      (typeof error === 'string' ? error : commonMessage)
    );
  } catch (error) {
    return commonMessage;
  }
};

export const getKeyMessageFromError = (error: AxiosError): string => {
  try {
    let errorMsgPath = (error?.response?.data as Record<string, string>)?.msg;

    if (errorMsgPath && typeof errorMsgPath === 'string') {
      return String(errorMsgPath?.toUpperCase() || COMMON_ERROR_KEY);
    }

    errorMsgPath = (error?.response?.data as Record<string, any>)?.error;

    if (errorMsgPath && typeof errorMsgPath === 'string') {
      const arraySnakeCase = errorMsgPath.split('.');
      let checkSnakeCase = true;
      arraySnakeCase.forEach(value => {
        checkSnakeCase = isSnakeCase(value);
        if (!checkSnakeCase) {
          return false;
        }
      });

      if (checkSnakeCase) {
        return errorMsgPath?.toUpperCase() || COMMON_ERROR_KEY;
      } else {
        return errorMsgPath;
      }
    }

    const errorsMsgObject = (error?.response?.data as Record<string, any>)?.errors;

    if (typeof errorsMsgObject === 'object') {
      const keys = Object.keys(errorsMsgObject);
      if (keys.length > 0 && (errorsMsgObject[keys[0]] as Array<any>)?.length > 0) {
        const message = errorsMsgObject[keys[0]][0] || '';
        return String(message)?.toUpperCase() || COMMON_ERROR_KEY;
      }
    }

    return (
      String((error?.response?.data as Record<string, string>)?.message) ||
      (typeof error === 'string' ? error : COMMON_ERROR_KEY)
    );
  } catch (error) {
    return COMMON_ERROR_KEY;
  }
};

export const getErrorsFromErrorResponse = (error: AxiosError<IError>) => {
  return (
    Array.isArray(error?.response?.data?.errors) ? error?.response?.data?.errors || [] : []
  ).map(item => ({
    property: item.property,
    errorCode: item.error_code,
    msg: item.msg,
    msgValues: item.msg_values,
  }));
};
