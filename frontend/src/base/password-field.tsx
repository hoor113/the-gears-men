import {
  VisibilityOffTwoTone as HideIcon,
  VisibilityTwoTone as ShowIcon,
} from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { useState } from 'react';

import { TBaseInputProps } from '@/base/base-form-input';

const PasswordField = (props: TBaseInputProps<string>) => {
  const { label, value, onBlur, onChange, readOnly, error } = props;

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <TextField
      label={label}
      value={value}
      onBlur={onBlur}
      onChange={(e) => onChange(e.target.value)}
      disabled={readOnly}
      fullWidth
      error={!!error}
      helperText={error?.message}
      InputProps={{
        type: showPassword ? 'text' : 'password',
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowPassword}
              edge="end"
              size="small"
              style={{ fontSize: 23 }}
            >
              {showPassword ? (
                <HideIcon fontSize="inherit" />
              ) : (
                <ShowIcon fontSize="inherit" />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordField;
