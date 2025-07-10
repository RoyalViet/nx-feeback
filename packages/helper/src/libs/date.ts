import { format as formatter } from 'date-fns/format';

export function formatDate(
  value: Date | string | number,
  format = 'yyyy/MM/dd (HH:mm:ss)',
  options?: Partial<{ fallback: string }>
): string {
  const fallback =
    options?.fallback !== null && options?.fallback !== undefined ? options.fallback : '--·--';
  try {
    let temp: number | string = Number(value);
    if (!temp && typeof value === 'string') {
      temp = value.includes('Z') ? value : value.replace(/-/g, '/');
    }
    return !value ? fallback : formatter(new Date(temp), format || 'yyyy/MM/dd (HH:mm:ss)');
  } catch (error) {
    return fallback;
  }
}

export function convertToLocale(timestampMs: number, sourceTimezone: number) {
  const diffMs = timestampMs - sourceTimezone * 60 * 60 * 1000;
  return diffMs;
}

export function convertToServerTime(localTimestampMs: number, serverTimezone: number) {
  const serverTimestampMs = localTimestampMs + serverTimezone * 60 * 60 * 1000;
  return serverTimestampMs;
}
