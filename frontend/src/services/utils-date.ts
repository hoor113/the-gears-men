import { Dayjs, default as _dayjs } from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/ko';
import 'dayjs/locale/vi';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

import i18n from '@/i18n';

_dayjs.locale('vi');
_dayjs.extend(utc);
_dayjs.extend(relativeTime);
_dayjs.extend(isBetween);
_dayjs.extend(customParseFormat);

export const dayjs = _dayjs;
export type TDayjs = Dayjs;

export const dateFormat = 'DD/MM/YYYY';
export const timeFormat = 'HH:mm:ss';

export const formatFromNow = (date: any) => {
  if (!date) return '';
  return dayjs(date).locale(i18n.language).fromNow();
};

export const formatDate = (date: any, format = dateFormat) => {
  if (!date) return '';
  return dayjs(date).locale(i18n.language).format(format);
};

export const mappedValue = (date?: any) => {
  if (!date) return undefined;
  return dayjs(date).utc(true);
};

export const isSameTime = (date1?: string, date2?: string, unit?: any) => {
  if (!date1 || !date2) return false;
  return dayjs(date1).isSame(dayjs(date2), unit);
};

export const isBetweenDate = (date: string, fromDate: string, toDate: string) =>
  dayjs(date).isBetween(fromDate, toDate);

export const sorterByDate =
  <T extends Record<string, any>>(sorterKey: keyof T) =>
  (a: T, b: T) =>
    dayjs(b[sorterKey]).valueOf() - dayjs(a[sorterKey]).valueOf();
