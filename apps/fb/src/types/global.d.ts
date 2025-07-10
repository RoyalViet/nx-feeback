import { ITelegramUser } from '@/models/apis/auth/auth.model';

declare global {
  type Await<T> = T extends Promise<infer A> ? A : never;

  type PartialSpecial<T, P extends string | number> = Omit<T, P> & {
    [key in P]?: key extends keyof T ? T[key] : never;
  };

  interface Window {
    onTelegramAuth?: (user: ITelegramUser) => void;
  }
}
