import { addDays, addHours, addMinutes, addMonths, addYears } from 'date-fns';
import Cookie from 'js-cookie';

export enum ECookieExpireUnit {
  MINUTES = 'minutes',
  HOURS = 'hours',
  DAYS = 'days',
  MONTHS = 'months',
  YEARS = 'years',
}

interface ICookieExpireTime {
  value: number;
  unit: ECookieExpireUnit;
}

interface ICookieConfig {
  shareable?: boolean;
  expire?: ICookieExpireTime;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  environment?: Record<string, any>;
}

export const getValueFromCookie = (key: string) => {
  return Cookie.get(key);
};

const calculateExpireDate = (expire?: ICookieExpireTime): Date => {
  if (!expire) return addYears(new Date(), 1);

  const { value, unit } = expire;
  const currentDate = new Date();

  switch (unit) {
    case ECookieExpireUnit.MINUTES:
      return addMinutes(currentDate, value);
    case ECookieExpireUnit.HOURS:
      return addHours(currentDate, value);
    case ECookieExpireUnit.DAYS:
      return addDays(currentDate, value);
    case ECookieExpireUnit.MONTHS:
      return addMonths(currentDate, value);
    case ECookieExpireUnit.YEARS:
      return addYears(currentDate, value);
    default:
      return addYears(currentDate, 1);
  }
};

export const setValueFromCookie = (key: string, value: string, config?: ICookieConfig) => {
  const expireDate = config?.expire ? calculateExpireDate(config.expire) : addYears(new Date(), 1);
  const cookieOptions = { expires: expireDate };

  if (config?.shareable) {
    if (String(config?.environment?.['APP_URL'])?.includes('localhost')) {
      Cookie.set(key, value, { ...cookieOptions, domain: 'localhost' });
    } else {
      switch (config?.environment?.['APP_ENV']) {
        case 'development':
          Cookie.set(key, value, {
            ...cookieOptions,
            domain: '.dev-bitcastle.work',
          });
          break;

        case 'staging':
          Cookie.set(key, value, {
            ...cookieOptions,
            domain: '.staging-bitcastle.work',
          });
          break;

        case 'production':
          Cookie.set(key, value, { ...cookieOptions, domain: '.bitcastle.io' });
          break;

        default:
          Cookie.set(key, value, { ...cookieOptions, domain: 'localhost' });
          break;
      }
    }
  } else {
    Cookie.set(key, value, cookieOptions);
  }
};

export const removeValueFromCookie = (
  key: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: { shareable: boolean; environment?: Record<string, any> }
) => {
  if (config?.shareable) {
    if (String(config?.environment?.['APP_URL'])?.includes('localhost')) {
      Cookie.remove(key);
      Cookie.remove(key, { domain: 'localhost' });
    } else {
      switch (String(config?.environment?.['APP_ENV'])) {
        case 'development':
          Cookie.remove(key);
          Cookie.remove(key, { domain: '.dev-bitcastle.work' });
          break;

        case 'staging':
          Cookie.remove(key);
          Cookie.remove(key, { domain: '.staging-bitcastle.work' });
          break;

        case 'production':
          Cookie.remove(key);
          Cookie.remove(key, { domain: '.bitcastle.io' });
          break;

        default:
          Cookie.remove(key);
          Cookie.remove(key, { domain: 'localhost' });
          break;
      }
    }
  } else {
    Cookie.remove(key);
  }
};
