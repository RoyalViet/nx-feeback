import environment from '@/environments/environment';
import { IGenericDataResponse } from '@/models/common';
import unauthorizedRequest from '@/utils/request/unauthorizedRequest.util';

export function getTranslationApi({ locale }: { locale: string }) {
  return unauthorizedRequest.get<IGenericDataResponse<{ translates: Record<string, string> }>>(
    `${environment.API_SERVICES.FB}/translation?locale=${locale}`
  );
}
