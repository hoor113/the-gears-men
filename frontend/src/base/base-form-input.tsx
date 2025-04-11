import { DeleteTwoTone } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  List,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker, DateTimePicker, TimePicker } from '@mui/x-date-pickers';
import { MuiFileInput } from 'mui-file-input';
import * as R from 'rambda';
import {
  Controller,
  ControllerRenderProps,
  FieldError,
  FieldValues,
} from 'react-hook-form';

import RTE from '@/components/rte';
import useTranslation from '@/hooks/use-translation';
import { mappedValue } from '@/services/utils-date';

import { ILVPair, TBaseFormMode } from './base.model';
import { TCrudFormField } from './crud-form-field.type';
import UploadImageInput from './upload-image-input';
import UploadMultiImageInput from './upload-multi-image-input';

export type TBaseInputProps<T> = {
  // mode?: boolean;
  field?: TCrudFormField;
  label: string;
  name: string;
  value: T;
  onBlur: () => void;
  onChange: (_value: T) => void;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  Component?: React.FC<any>;
  options?: ILVPair<any>[];
  error?: FieldError;
};

type TInputDetailProps = {
  field: TCrudFormField;
  rhf: ControllerRenderProps<FieldValues, string>;
  error?: FieldError;
  mode?: TBaseFormMode;
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const InputDetail = (props: TInputDetailProps) => {
  const { field, rhf, error } = props;

  const { t } = useTranslation();

  switch (field.type) {
    case 'text':
      return (
        <TextField
          {...rhf}
          label={field.label}
          required={field.required}
          fullWidth
          type="text"
          error={!!error}
          helperText={error?.message}
          disabled={field.readOnly}
          value={rhf.value || ''}
          onChange={(e) => {
            rhf.onChange(e.target.value);
            field?.onChange?.(e.target.value);
          }}
          {...field.props}
        />
      );
    case 'number':
      return (
        <TextField
          {...rhf}
          label={field.label}
          required={field.required}
          fullWidth
          type="number"
          disabled={field.readOnly}
          error={!!error}
          helperText={error?.message}
          value={rhf.value || 0}
          onChange={(e) => {
            const n = Number(e.target.value);
            rhf.onChange(n);
            field?.onChange?.(n);
          }}
          {...field.props}
        />
      );
    case 'date':
      rhf.value = mappedValue(rhf.value);
      return (
        <DatePicker<any>
          {...rhf}
          label={field.label}
          disabled={field.readOnly}
          slotProps={{
            textField: {
              ...rhf,
              disabled: field.readOnly,
              required: field.required,
              fullWidth: true,
              error: !!error,
              helperText: error?.message,
            },
            field: {
              clearable: true,
              onClear: () => {
                rhf.onChange(null);
                field?.onChange?.(null);
              },
            },
          }}
          value={rhf.value || null}
          onChange={(value) => {
            rhf.onChange(value);
            field?.onChange?.(value);
          }}
          timezone="UTC"
          {...field.props}
        />
      );
    case 'datetime':
      rhf.value = mappedValue(rhf.value);
      return (
        <DateTimePicker<any>
          {...rhf}
          label={field.label}
          disabled={field.readOnly}
          slotProps={{
            textField: {
              ...rhf,
              disabled: field.readOnly,
              required: field.required,
              fullWidth: true,
              error: !!error,
              helperText: error?.message,
            },
            field: {
              clearable: true,
              onClear: () => {
                rhf.onChange(null);
                field?.onChange?.(null);
              },
            },
          }}
          value={rhf.value || null}
          onChange={(value) => {
            rhf.onChange(value);
            field?.onChange?.(value);
          }}
          timezone="UTC"
          {...field.props}
        />
      );
    case 'time':
      rhf.value = mappedValue(rhf.value);
      return (
        <TimePicker<any>
          {...rhf}
          label={field.label}
          disabled={field.readOnly}
          slotProps={{
            textField: {
              ...rhf,
              disabled: field.readOnly,
              required: field.required,
              fullWidth: true,
              error: !!error,
              helperText: error?.message,
            },
            field: {
              clearable: true,
              onClear: () => {
                rhf.onChange(null);
                field?.onChange?.(null);
              },
            },
          }}
          referenceDate={new Date()}
          value={rhf.value || null}
          onChange={(value) => {
            rhf.onChange(value);
            field?.onChange?.(value);
          }}
          timezone="UTC"
          {...field.props}
        />
      );
    case 'checkbox':
      return (
        <FormControl fullWidth>
          <FormControlLabel
            label={field.label}
            required={field.required}
            control={
              <Checkbox
                disabled={field.readOnly}
                checked={rhf.value}
                onChange={(e) => {
                  rhf.onChange(e.target.checked);
                  field?.onChange?.(e.target.checked);
                }}
                {...field.props}
              />
            }
          />
        </FormControl>
      );
    case 'select':
      return (
        <TextField
          {...rhf}
          select
          label={field.label}
          required={field.required}
          fullWidth
          type="text"
          disabled={field.readOnly}
          error={!!error}
          helperText={error?.message}
          onChange={(e) => {
            rhf.onChange(e.target.value);
            field?.onChange?.(e.target.value);
          }}
          {...field.props}
        >
          {field?.options?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      );
    case 'multiselect':
      return (
        <FormControl fullWidth required={field.required} error={!!error}>
          <InputLabel>{field.label}</InputLabel>
          <Select
            ref={rhf.ref}
            input={
              <OutlinedInput label={field.label} disabled={field.readOnly} />
            }
            multiple
            disabled={field.readOnly}
            error={!!error}
            value={rhf.value || []}
            MenuProps={MenuProps}
            renderValue={(selecteds) =>
              selecteds
                ? R.compose(
                    R.join(', '),
                    R.map((selected: ILVPair<any>) => selected.label),
                    R.filter(
                      (option: ILVPair<any>) =>
                        (selecteds as any)?.includes(option.value),
                    ),
                  )(field.options || ([] as ILVPair<any>[]))
                : ''
            }
            onChange={(event: SelectChangeEvent<typeof field.options>) => {
              rhf.onChange(event.target.value);
              field?.onChange?.(event.target.value);
            }}
            {...field.props}
          >
            {field.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox checked={rhf.value?.includes(option.value)} />
                <ListItemText primary={option.label} />
              </MenuItem>
            ))}
          </Select>
          <FormHelperText error={!!error}>{error?.message}</FormHelperText>
        </FormControl>
      );
    case 'textarea':
      return (
        <TextField
          {...rhf}
          label={field.label}
          required={field.required}
          fullWidth
          multiline
          rows={3}
          disabled={field.readOnly}
          error={!!error}
          helperText={error?.message}
          onChange={(e) => {
            rhf.onChange(e.target.value);
            field?.onChange?.(e.target.value);
          }}
          {...field.props}
        />
      );
    case 'autocomplete':
      return (
        <Autocomplete
          fullWidth
          disabled={field.readOnly}
          options={field.options || []}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, e) => R.equals(option, e)}
          renderInput={(params) => (
            <TextField
              {...params}
              label={field.label}
              required={field.required}
              error={!!error}
              helperText={error?.message}
              {...field.props}
            />
          )}
          value={
            field.options?.find((option) =>
              R.equals(option.value, rhf.value),
            ) || null
          }
          onChange={(_, data) => {
            field?.onChange?.(data?.value);
            rhf.onChange(data?.value);
          }}
        />
      );
    case 'autocomplete-infinite':
      return (
        <Autocomplete
          fullWidth
          disabled={field.readOnly}
          options={field.options || []}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, e) => R.equals(option, e)}
          renderInput={(params) => (
            <TextField
              {...params}
              label={field.label}
              required={field.required}
              error={!!error}
              helperText={error?.message}
              {...field.props}
            />
          )}
          value={
            field.options?.find((option) =>
              R.equals(option.value, rhf.value),
            ) || null
          }
          onChange={(_, data) => {
            field?.onChange?.(data?.value);
            rhf.onChange(data?.value);
          }}
          ListboxProps={{
            onScroll: field?.handleScroll,
            ref: field?.ref,
          }}
          renderOption={(props, option) => (
            <>
              <List
                component="li"
                sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                {...props}
              >
                {option.label}
              </List>
            </>
          )}
        />
      );
    case 'multiautocomplete':
      return (
        <Autocomplete
          multiple
          disableCloseOnSelect
          fullWidth
          disabled={field.readOnly}
          options={field.options || []}
          renderInput={(params) => (
            <TextField
              label={field.label}
              required={field.required}
              error={!!error}
              helperText={error?.message}
              {...params}
              {...field.props}
            />
          )}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox checked={selected} />
              {option.label}
            </li>
          )}
          value={R.filter(
            (option) =>
              (rhf.value as any)?.find((item: any) =>
                R.equals(item, option.value),
              ),
            field.options || ([] as ILVPair<any>[]),
          )}
          onChange={(_, data) => {
            field?.onChange?.(data?.map((item) => item.value));
            rhf.onChange(data?.map((item) => item.value));
          }}
        />
      );
    case 'rte':
      return (
        <>
          {field.label && (
            <FormLabel required={field.required}>{field.label}</FormLabel>
          )}
          <RTE
            {...rhf}
            readOnly={field.readOnly}
            value={rhf.value || ''}
            onChange={(value) => {
              rhf.onChange(value);
              field?.onChange?.(value);
            }}
            {...field.props}
          />
        </>
      );
    case 'radio':
      return (
        <FormControl>
          {field.label && (
            <FormLabel required={field.required}>{field.label}</FormLabel>
          )}
          <RadioGroup
            {...rhf}
            row
            value={rhf.value || null}
            onChange={(e) => {
              rhf.onChange(e.target.value);
              field?.onChange?.(e.target.value);
            }}
            {...field.props}
          >
            {field?.options?.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                disabled={field.readOnly}
                control={<Radio size={field?.props?.size} />}
                label={option.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
      );
    case 'uploadimage':
      return (
        <Stack pb={1}>
          {field.label && (
            <FormLabel required={field.required}>{field.label}</FormLabel>
          )}
          <UploadImageInput
            readOnly={field.readOnly}
            value={rhf.value || null}
            onChange={(value) => {
              rhf.onChange(value);
              field?.onChange?.(value);
            }}
            {...field.props}
          />
        </Stack>
      );
    case 'uploadlistimage':
      return (
        <Stack
          sx={{
            width: '50%',
          }}
          pb={1}
        >
          {field.label && (
            <FormLabel required={field.required}>{field.label}</FormLabel>
          )}
          <UploadMultiImageInput
            {...rhf}
            readOnly={field.readOnly}
            value={rhf.value || null}
            onChange={(value) => {
              rhf.onChange(value);
              field?.onChange?.(value);
            }}
            {...field.props}
          />
        </Stack>
      );
    case 'uploadfile':
      return (
        <Stack
          sx={{
            width: '100%',
          }}
        >
          {/* <FormLabel>{field.label}</FormLabel> */}
          {typeof rhf.value === 'string' && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  border: '1px dashed #ccc',
                  padding: '0.5em',
                  borderRadius: '0.5em',
                  backgroundColor: '#fafafa',
                }}
              >
                <Typography>{rhf.value}</Typography>
              </Box>

              <IconButton
                color="error"
                onClick={() => {
                  rhf.onChange(null);
                  field?.onChange?.(null);
                }}
              >
                <DeleteTwoTone />
              </IconButton>
            </Box>
          )}
          {typeof rhf.value !== 'string' && (
            <MuiFileInput
              label={field.label || t('Chọn file')}
              disabled={field.readOnly}
              value={rhf.value || null}
              onChange={(e) => {
                rhf.onChange(e);
                field?.onChange?.(e);
              }}
              hiddenLabel={true}
              multiple={false}
            />
          )}
        </Stack>
      );
    case 'custom':
      return field.Component ? (
        <field.Component
          field={field}
          label={field.label}
          name={field.name}
          value={rhf.value || null}
          readOnly={field.readOnly}
          disabled={field.readOnly}
          required={field.required}
          error={error}
          onBlur={rhf.onBlur}
          onChange={(value: any) => {
            rhf.onChange(value);
            field?.onChange?.(value);
          }}
          options={field.options}
          {...field.props}
        />
      ) : (
        <></>
      );
    case 'blank':
      return <Box sx={{ width: '100%' }}></Box>;
    case 'datetime-local':
      return (
        <TextField
          {...rhf}
          label={field.label}
          required={field.required}
          fullWidth
          type="datetime-local"
          disabled={field.readOnly}
          error={!!error}
          helperText={error?.message}
          value={rhf.value || ''}
          onChange={(e) => {
            rhf.onChange(e.target.value);
            field?.onChange?.(e.target.value);
          }}
          {...field.props}
          InputLabelProps={{ shrink: true }}
        />
      );
    default:
      return null;
  }
};

type TBaseFormInputProps = {
  field: TCrudFormField;
  control?: any;
  mode?: TBaseFormMode;
};

const BaseFormInput = ({ field, control, ...rest }: TBaseFormInputProps) => {
  if (field.type === 'label') {
    return (
      <Typography fontWeight={600} sx={{ pt: 1 }}>
        {field.label}
      </Typography>
    );
  } else if (!field.name && field.type === 'custom' && field.Component) {
    return <field.Component control={control} {...field} />;
  } else if (field.type === 'empty' || !field.name) {
    return null;
  }

  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: rhf, fieldState: { error } }) => (
        <InputDetail field={field} rhf={rhf} error={error} {...rest} />
      )}
    />
  );
};

export default BaseFormInput;
