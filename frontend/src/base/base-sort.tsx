import { LayersTwoTone } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  InputAdornment,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import { useId, useState } from 'react';

type TBaseOption = {
  value: string;
  label: string;
  [name: string]: any;
};

type TBaseSortProps = {
  options?: TBaseOption[];
  value?: TBaseOption;
  placeholder?: string;
  onChange?: (_data?: any) => void;
};

const BaseSort = ({
  options = [],
  placeholder,
  value,
  onChange,
}: TBaseSortProps) => {
  const uid = useId();
  const [selectedOption, setSelectedOption] = useState<TBaseOption>();

  return (
    <Autocomplete
      key={uid + JSON.stringify(selectedOption || {})}
      defaultValue={null}
      size="small"
      disablePortal
      options={options}
      renderInput={({ InputProps, InputLabelProps, ...params }) => (
        <TextField
          placeholder={placeholder}
          sx={(theme) => ({
            minWidth: selectedOption
              ? `calc(${
                  selectedOption.label.length > 24
                    ? selectedOption.label.length - 2.2
                    : selectedOption.label.length > 22
                      ? selectedOption.label.length
                      : selectedOption.label.length + 1.1
                }ch + 44px)`
              : '122px',
            '.MuiFormLabel-root': {
              paddingTop: '2px',
              fontWeight: 600,
              color: theme.palette.primary.main,
            },
            '.MuiAutocomplete-clearIndicator': {
              visibility: 'visible',
            },
            '.MuiInputBase-root': {
              height: 42.5,
              borderRadius: '12px',
              flexWrap: 'nowrap',
              '& input::placeholder': {
                color: theme.palette.primary.main,
                opacity: 1,
                fontSize: 'inherit',
              },
              '&.Mui-focused input::placeholder': {
                opacity: 0.5,
              },
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: alpha(theme.palette.primary.main, 0.5),
              },
              '.MuiInputAdornment-root': {
                color: theme.palette.primary.main,
              },
            },
          })}
          InputProps={{
            ...InputProps,
            startAdornment: (
              <InputAdornment position="end">
                <LayersTwoTone fontSize="small" />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ shrink: true, ...InputLabelProps }}
          {...params}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props} key={JSON.stringify(option)}>
          <Typography variant="caption" fontSize={16}>
            {option.label}
          </Typography>
        </Box>
      )}
      value={value || selectedOption}
      onChange={(_, data) => {
        onChange?.(data);
        setSelectedOption(data || undefined);
      }}
      forcePopupIcon={false}
      disableListWrap
      includeInputInList
      componentsProps={{
        popper: {
          style: { minWidth: 'fit-content' },
          placement: 'bottom-end',
        },
      }}
    />
  );
};

export default BaseSort;
