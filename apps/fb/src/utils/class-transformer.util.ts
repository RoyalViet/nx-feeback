import { BigNumber } from 'bignumber.js';
import { plainToClass as pTC } from 'class-transformer';
import { ClassConstructor, ClassTransformOptions } from 'class-transformer/types';

const cloneWithBigNumber = <T>(obj: T): T => {
  if (BigNumber.isBigNumber(obj)) {
    return obj;
  }

  if (obj instanceof Date) {
    return obj;
  }

  if (Array.isArray(obj)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return obj.map(item => cloneWithBigNumber(item)) as any;
  }

  if (typeof obj === 'object') {
    const descriptors = Object.getOwnPropertyDescriptors(obj);
    const result = Object.keys(descriptors).reduce(
      (acc: Record<string, unknown>, item: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value = (obj as any)[item];
        acc[item] = cloneWithBigNumber(value);
        return acc;
      },
      {} as Record<string, unknown>
    );
    return result as T;
  }

  return obj;
};

export function plainToClass<T, V>(
  cls: ClassConstructor<T>,
  plain: V[],
  options?: ClassTransformOptions
): T[];

export function plainToClass<T, V>(
  cls: ClassConstructor<T>,
  plain: V,
  options?: ClassTransformOptions
): T;

export function plainToClass<T, V>(
  cls: ClassConstructor<T>,
  plain: V[] | V,
  options?: ClassTransformOptions
) {
  const c = pTC(cls, plain, { excludeExtraneousValues: true, ...options });
  const o = cloneWithBigNumber(c);
  return o;
}
