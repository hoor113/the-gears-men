import * as yup from 'yup';

import { ILVPair } from './base.model';

export type TInputType =
  | 'text'
  | 'number'
  | 'select'
  | 'date'
  | 'time'
  | 'datetime'
  | 'datetime-local'
  | 'textarea'
  | 'checkbox'
  | 'radio'
  | 'multiselect'
  | 'autocomplete'
  | 'multiautocomplete'
  | 'multiselect'
  | 'rte'
  | 'uploadimage'
  | 'uploadlistimage'
  | 'custom'
  | 'blank'
  | 'uploadfile'
  | 'label'
  | 'empty'
  | 'autocomplete-infinite';

export type TCrudFormField = {
  label?: string;
  name?: string;
  type: TInputType;
  readOnly?: boolean;
  options?: ILVPair<any>[];
  required?: boolean;
  colSpan?: number;
  hidden?: boolean;
  noRender?: boolean;
  defaultValue?: any;
  props?: any;
  labelProps?: any;
  valueProps?: any | ((_value: any) => any);
  formatValue?: (_value: any) => any;
  onChange?: (_value: any) => void;
  Component?: React.FC<any> | any;
  handleScroll?: () => void;
  ref?: any;
  isFetchingNextPage?: any;
};

export type TCrudFormSchema = yup.ObjectSchema<any>;

export enum ESortBy {
  ASC = 1,
  DESC = 2,
}
