import { ReactNode } from 'react';
import { NextPage } from 'next';
import { AppInitialProps } from 'next/app';

export interface LayoutProps {
  children: ReactNode;
  dynamicLayout?: boolean;
}

export interface PageWithLayout {
  renderLayout?: ({
    children,
    dynamicLayout,
  }: {
    children: ReactNode;
    dynamicLayout?: boolean;
  }) => ReactNode;
}

export type NextPageWithData<P = Record<string, unknown>, IP = P> = PageWithLayout &
  NextPage<P, IP> & {
    auth?: {
      minLevel: number;
      loading?: ReactNode;
      unauthorized?: string; // redirect to this url
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback?: (ctx: any) => void;
    };
    keysMultiLanguage?: string[];
    dynamicLayout?: boolean;
  };

export interface ComponentStatic {
  getInitialProps: Promise<AppInitialProps>;
}

export interface IGenericDataResponse<T> {
  data: T;
  timestamp?: string;
}

export interface IGenericDataListResponse<T> {
  data: T[];
  page: number;
  size: number;
  totalItem: number;
  totalPage: number;
  timestamp?: number;
}

export type TWrappedTypeOptional<T> = {
  [Key in keyof T]: T[Key] extends object
    ? TWrappedTypeOptional<T[Key]>
    : T[Key] | null | undefined | string;
};
