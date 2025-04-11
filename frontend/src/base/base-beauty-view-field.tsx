import {
  Box,
  Checkbox,
  Divider,
  Stack,
  Typography,
  TypographyProps,
} from '@mui/material';
import { ReactNode } from 'react';
import { FieldValues, UseFormWatch } from 'react-hook-form';

import useTranslation from '@/hooks/use-translation';
import { formatDate } from '@/services/utils-date';

import { TCrudFormField } from './crud-form-field.type';

type TBaseBeautyViewFieldProps = {
  field: TCrudFormField;
  watch: UseFormWatch<FieldValues>;
};

const BaseBeautyViewField = ({ field, watch }: TBaseBeautyViewFieldProps) => {
  if (!field.name && field.type !== 'custom') {
    return (
      <>
        <Typography variant="subtitle2" fontWeight={600} {...field.labelProps}>
          {field.label}
        </Typography>
        <Divider />
      </>
    );
  }

  const value = watch(field.name || '');

  return (
    <Stack>
      <StyledLabel props={field.labelProps}>{field.label}</StyledLabel>
      <StyledValue value={value} field={field} />
    </Stack>
  );
};

export default BaseBeautyViewField;

const StyledLabel = ({
  children,
  props,
}: {
  children: ReactNode;
  props: any;
}) => {
  return (
    <Typography variant="body2" color="GrayText" {...props}>
      {children}
    </Typography>
  );
};

const StyledTypoValue = (props: TypographyProps) => {
  const { t } = useTranslation();

  if (!props.children) {
    return (
      <Typography variant="body1" color="GrayText" fontWeight={500} {...props}>
        {t('Không có')}
      </Typography>
    );
  }

  return <Typography variant="body1" fontWeight={500} {...props} />;
};

const StyledValue = ({
  value,
  field,
}: {
  value: any;
  field: TCrudFormField;
}) => {
  const { label, type, options, Component, labelProps, formatValue } = field;
  let valueProps = field.valueProps || {};

  if (formatValue) {
    value = formatValue(value);
  }

  if (typeof valueProps === 'function') {
    valueProps = valueProps(value);
  }

  switch (type) {
    case 'text':
    case 'number':
    case 'textarea':
      return <StyledTypoValue {...valueProps}>{value}</StyledTypoValue>;
    case 'radio':
    case 'select':
    case 'autocomplete':
      return (
        <StyledTypoValue {...valueProps}>
          {options?.find((o) => o.value === value)?.label || value}
        </StyledTypoValue>
      );
    case 'multiselect':
    case 'multiautocomplete':
      return (
        <StyledTypoValue {...valueProps}>
          {value
            ?.map((v: any) => options?.find((o) => o.value === v)?.label || v)
            .join(', ')}
        </StyledTypoValue>
      );
    case 'date':
      return (
        <StyledTypoValue {...valueProps}>
          {value ? formatDate(value) : ''}
        </StyledTypoValue>
      );
    case 'datetime':
      return (
        <StyledTypoValue {...valueProps}>
          {value ? formatDate(value, 'DD/MM/YYYY HH:mm:ss') : ''}
        </StyledTypoValue>
      );
    case 'time':
      return (
        <StyledTypoValue {...valueProps}>
          {formatDate(value, 'HH:mm:ss')}
        </StyledTypoValue>
      );
    case 'checkbox':
      return <Checkbox checked={value} disabled {...valueProps} />;
    case 'rte':
      return (
        <Box dangerouslySetInnerHTML={{ __html: value }} {...valueProps} />
      );
    case 'uploadimage':
      if (!value) return <StyledTypoValue>{value}</StyledTypoValue>;

      return <img src={value} alt="" {...valueProps} />;
    case 'uploadlistimage':
      return (
        <Stack direction="row" spacing={1} {...valueProps}>
          {value?.map((v: any) => <img key={v} src={v} alt="" />)}
        </Stack>
      );
    case 'label':
      return <StyledTypoValue {...labelProps}>{label}</StyledTypoValue>;
    case 'custom':
      return !Component ? null : (
        <Component field={field} value={value} mode="view" beautyView={true} />
      );
    default:
      return <StyledTypoValue {...valueProps}>{value}</StyledTypoValue>;
  }
};
