/* eslint-disable @typescript-eslint/ban-types */
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { ForwardRefRenderFunction, forwardRef, useState } from 'react';

type TPasswordInputProps = {} & Omit<TextFieldProps, 'name'>;

const PasswordInput: ForwardRefRenderFunction<
  HTMLInputElement,
  TPasswordInputProps
> = (props, forwardedRef) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <TextField
      inputRef={forwardedRef}
      InputProps={{
        type: showPassword ? 'text' : 'password',
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              size="small"
              style={{ fontSize: 23 }}
            >
              {showPassword ? (
                <VisibilityOff fontSize="inherit" />
              ) : (
                <Visibility fontSize="inherit" />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};

export default forwardRef(PasswordInput);
