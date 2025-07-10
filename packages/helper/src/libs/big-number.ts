import BigNumber from 'bignumber.js';

export function bigNumber(value?: string | number | BigNumber) {
  return new BigNumber(String(value || 0).trim());
}

export function toString(
  value: string | number | BigNumber,
  options?: Partial<{ notANumber: boolean }>
) {
  if (options?.notANumber) {
    return value?.toString();
  }
  if (typeof value === 'object' || typeof value === 'number') {
    const temp = (value as BigNumber | number)?.toString();
    if (temp.includes('e-')) {
      return new BigNumber(temp).plus(1).toString().replace('1', '0');
    }
    return temp;
  } else {
    if (value.includes('e-')) {
      return new BigNumber(value).plus(1).toString().replace('1', '0');
    }
    return value || '';
  }
}

export function toNumber(value?: string | number | BigNumber) {
  if (typeof value === 'object') {
    return (value as BigNumber)?.toNumber() || 0;
  }
  if (typeof value === 'string') {
    return new BigNumber(value || 0).toNumber();
  }
  return Number(value || 0);
}

export function isFalsy(value?: string | number | BigNumber) {
  if (typeof value === 'object') {
    return (
      new BigNumber(value as BigNumber)?.isEqualTo(0) || new BigNumber(value as BigNumber)?.isNaN()
    );
  }
  return new BigNumber(value || 0)?.isEqualTo(0) || !value;
}

export function convertValueStringToBigNumber(value: string) {
  return bigNumber(value.replace(/,/g, ''));
}

export function getDecimal(value: number | string | BigNumber) {
  if (isFalsy(value) || toNumber(value) === 1) {
    return 0;
  }

  const numberString = toString(
    typeof value === 'string' ? convertValueStringToBigNumber(value) : bigNumber(value)
  );
  if (value && !numberString.includes('e')) {
    return numberString.split('.')?.[1]?.length || 0;
  }

  const bigNumberE = bigNumber(numberString).e || 0;
  const decimal = bigNumberE < 0 ? -bigNumberE : 0;
  return decimal;
}

export function formatBigNumberByUnit(
  num: number | BigNumber,
  options?: Partial<{ decimal: number }>
) {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const bigNum = bigNumber(num);

  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return bigNum.isGreaterThanOrEqualTo(item.value);
    });

  if (item) {
    const fmt = {
      decimalSeparator: '.',
      groupSeparator: ',',
      groupSize: 3,
    };

    return (
      bigNum.dividedBy(item.value).toFormat(options?.decimal ?? 3, BigNumber.ROUND_DOWN, fmt) +
      item.symbol
    );
  }

  return toString(bigNum);
}

export function getValueWithDecimal(
  value: number | string | BigNumber = 0,
  decimal = 2,
  options?: { roundUp?: boolean }
) {
  if (!value) return '';
  if (options?.roundUp) {
    return bigNumber(value).toFixed(decimal);
  } else {
    const decimalValue = getDecimal(value);
    const numberString = `${bigNumber(value).toFixed(decimalValue)}`;
    const arrayValue = numberString.split('.');
    if (arrayValue?.[1]?.length > decimal) {
      return `${arrayValue?.[0]}.${arrayValue?.[1].substring(0, decimal)}`;
    }
    return numberString;
  }
}

export function formatSmallNumberByUnit(
  num: number | BigNumber,
  options?: Partial<{ decimal: number; spaceSymbol: boolean }>
) {
  const lookup = [
    { value: 1, max: 1, symbol: '' },
    { value: 1e-3, max: 1, symbol: 'm' },
    { value: 1e-6, max: 1e-3, symbol: 'μ' },
    { value: 1e-9, max: 1e-6, symbol: 'n' },
  ];

  const bigNum = bigNumber(num);

  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return bigNum.isLessThan(item.max);
    });

  return item
    ? `${getValueWithDecimal(
        bigNum.dividedBy(item.value),
        options?.decimal ?? 3
      )}${options?.spaceSymbol ? ' ' : ''}${item.symbol}`
    : toString(bigNum);
}

export function formatCurrencyByPrecision(
  value: string | number | BigNumber,
  precision: string | number | BigNumber, // ex: 0.01
  options?: Partial<{
    keepOriginal: boolean;
    prefix: string;
    suffix: string;
    empty: string;
    maxDecimal: number;
    clearTrailingZeros: boolean;
    notFormat: boolean;
    roundDown: boolean;
    limitChar: number;
    formatSmallValue: boolean;
    formatBigValue: boolean;
    noEmpty: boolean;
    noGroupSeparator: boolean;
    absoluteRoundUp: boolean;
  }>
) {
  try {
    if (isFalsy(value) && !options?.noEmpty) {
      return options?.empty || '0';
    }

    if (bigNumber(value).gte(1000000) && options?.formatBigValue) {
      let result = formatBigNumberByUnit(bigNumber(value));

      if (options?.clearTrailingZeros && result.match(/\./)) {
        const unit = result[result.length - 1];
        result = `${result.substring(0, result.length - 1).replace(/\.?0+$/, '')}${unit}`;
      }
      if (options?.prefix) {
        result = `${options.prefix}${result}`;
      }
      if (options?.suffix) {
        result = `${result}${options.suffix}`;
      }
      return result;
    } else if (bigNumber(value).isLessThan(1) && options?.formatSmallValue) {
      let result = formatSmallNumberByUnit(bigNumber(value));
      if (options?.prefix) {
        result = `${options.prefix}${result}`;
      }
      if (options?.suffix) {
        result = `${result}${options.suffix}`;
      }
      return result;
    }

    const fmt = {
      decimalSeparator: '.',
      groupSeparator: options?.noGroupSeparator ? undefined : ',',
      groupSize: 3,
    };

    if (options?.keepOriginal) {
      const arr = String(value).split('.');
      return `${bigNumber(arr[0]).toFormat(fmt)}${arr?.[1] ? `.${arr?.[1]}` : ''}`;
    }

    let originalValueFormatted = '';
    let maxDecimal = options?.maxDecimal !== undefined ? options.maxDecimal : 11;
    if (options?.limitChar) {
      const limitDecimal =
        options.limitChar >
        bigNumber(value).toFixed(getDecimal(value)).toString().split('.')[0].length + 1
          ? options.limitChar -
            (bigNumber(value).toFixed(getDecimal(value)).toString().split('.')[0].length + 1)
          : 0;
      maxDecimal = Math.min(maxDecimal, limitDecimal);
    }
    const decimal = options?.notFormat ? getDecimal(value) : getDecimal(precision);
    const decimalFormat = Math.min(maxDecimal, decimal);

    if (options?.absoluteRoundUp) {
      originalValueFormatted = bigNumber(value).toFormat(decimalFormat, BigNumber.ROUND_UP, fmt);
    } else if (options?.roundDown) {
      originalValueFormatted = bigNumber(value).toFormat(decimalFormat, BigNumber.ROUND_DOWN, fmt);
      // if (bigNumber(value).gte(0)) {
      //   originalValueFormatted = bigNumber(value).toFormat(decimalFormat, BigNumber.ROUND_DOWN, fmt);
      // } else {
      //   originalValueFormatted = bigNumber(value).toFormat(decimalFormat, BigNumber.ROUND_UP, fmt);
      // }
    } else {
      originalValueFormatted = bigNumber(value).toFormat(
        decimalFormat,
        BigNumber.ROUND_HALF_CEIL,
        fmt
      );
    }

    if (options?.clearTrailingZeros && originalValueFormatted.match(/\./)) {
      originalValueFormatted = originalValueFormatted.replace(/\.?0+$/, '');
    }
    if (options?.prefix) {
      originalValueFormatted = `${options.prefix}${originalValueFormatted}`;
    }
    if (options?.suffix) {
      originalValueFormatted = `${originalValueFormatted}${options.suffix}`;
    }

    return originalValueFormatted;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return '';
  }
}

export const initZeroBigNumber = bigNumber(0);

export { BigNumber };
