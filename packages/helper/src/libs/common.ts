import { AxiosResponse } from 'axios';
import { flatMapDeep, isObject, isString } from 'lodash';

export const leadingZero = (n: number) => {
  if (n < 10) {
    return '0' + n;
  } else {
    return n;
  }
};

export const fallbackLang = (lang: string, config?: Partial<{ excludes: Array<string> }>) => {
  if (config?.excludes?.length && config.excludes.includes(lang)) {
    return lang;
  }
  return lang || 'en';
};

export function isIOS() {
  try {
    const navigator = window.navigator;
    return (
      ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(
        navigator.platform
      ) ||
      // iPad on iOS 13 detection
      (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
    );
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function isAndroid() {
  try {
    const userAgent: string = window.navigator.userAgent.toLowerCase();
    return userAgent.includes('android');
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function isSnakeCase(value: string): boolean {
  const regex = /^[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*$/gm;
  return regex.test(value);
}

export function parseParams<T = { [key: string]: string | string[] }>(querystring: string) {
  const params = new URLSearchParams(querystring);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obj: any = {} as T;

  for (const key of params.keys()) {
    if (params.getAll(key).length > 1) {
      obj[key] = params.getAll(key);
    } else {
      obj[key] = params.get(key) as string;
    }
  }
  return obj as T;
}

export const shortenString = (str: string): string => {
  return str.slice(0, 6) + '***' + str.slice(str.length - 7);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAllValues = (obj: any): string[] => {
  return flatMapDeep(obj, value => {
    if (isString(value)) {
      return value;
    }
    if (isObject(value) && !isString(value)) {
      return getAllValues(value);
    }
    return [];
  });
};

// export const downloadCSVClient = (headers: Array<string>, csvData: Array<any>, name: string) => {
//   try {
//     const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);

//     link.setAttribute('href', url);
//     link.setAttribute('download', `${name}.csv`);
//     link.style.visibility = 'hidden';

//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   } catch (error) {
//     console.error(error);
//   }
// };

export async function downloadCSV(
  title: string,
  response: AxiosResponse<any>,
  options?: {
    utf8?: boolean;
    forceTitle?: boolean;
  }
) {
  try {
    const url = window.URL.createObjectURL(
      new Blob(options?.utf8 ? ['\uFEFF', response.data] : [response.data], {
        type: response.headers['content-type'],
      })
    );
    let filename = title;
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    if (!options?.forceTitle) {
      const matches = filenameRegex.exec(`${response.headers['content-disposition']}`);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    await link.click();

    // Clean up and remove the link
    link?.parentNode?.removeChild(link);
    // import('xlsx').then((XLSX) => {
    // const ws = XLSX.utils.aoa_to_sheet(response);
    //   const wb = XLSX.utils.book_new();
    //   XLSX.utils.book_append_sheet(wb, ws, 'Dividends');
    //   XLSX.writeFile(wb, `Dividends ${formatDate(new Date().getTime(), 'yyyy-MM-dd')}.csv`);
    // });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error :', error);
  }
}
