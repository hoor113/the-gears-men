import {
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  FormControlLabelProps,
} from '@mui/material';
import { ForwardRefRenderFunction, forwardRef } from 'react';

type TCheckboxLabelProps = {
  checkboxStyle?: React.CSSProperties;
} & Omit<CheckboxProps, 'value' | 'onChange'> &
  Pick<
    FormControlLabelProps,
    'name' | 'label' | 'value' | 'onChange' | 'labelPlacement'
  >;

const CheckboxLabel: ForwardRefRenderFunction<
  HTMLInputElement,
  TCheckboxLabelProps
> = (
  {
    label,
    name,
    style,
    checkboxStyle,
    value,
    onChange,
    labelPlacement,
    ...props
  },
  forwardedRef,
) => {
  return (
    <FormControlLabel
      name={name}
      label={label}
      style={style}
      value={value}
      labelPlacement={labelPlacement}
      onChange={onChange}
      control={
        <Checkbox inputRef={forwardedRef} style={checkboxStyle} {...props} />
      }
    />
  );
};

export default forwardRef(CheckboxLabel);
