import { yupResolver } from '@hookform/resolvers/yup';
import {
  Breakpoint,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useUpdateEffect } from 'react-use';

// import { RhfDevTool } from '@/components/custom-rhf-devtool';
import DialogExtend from '@/components/dialog-extend';
import useTranslation from '@/hooks/use-translation';
import appService from '@/services/app/app.service';
import { convertFieldsToValues } from '@/services/utils';

import BaseCrudFormContainer from './base-crud-form-container';
import { BaseCrudService } from './base-crud-service';
import { TBaseFormMode, TBaseModalProps } from './base.model';
import { TCrudFormField, TCrudFormSchema } from './crud-form-field.type';

export type TBaseCrudFormModalProps = {
  name: string;
  title: string;
  mode: TBaseFormMode;
  service?: BaseCrudService;
  createPath?: string;
  updatePath?: string;
  submitAction?: (_data: any) => Promise<any>;
  schema?: TCrudFormSchema;
  fields?: TCrudFormField[];
  tabFields?: {
    label: string;
    fields: TCrudFormField[];
  }[];
  defaultValues?: any;
  refetchData?: () => void;
  refetchOne?: () => void;
  maxWidth?: Breakpoint | false;
  ActionButtons?: JSX.Element;
  rowKey?: string;
  beautyView?: boolean;
} & TBaseModalProps;

const BaseCrudFormModal = (props: TBaseCrudFormModalProps) => {
  const {
    title,
    mode,
    service,
    createPath,
    updatePath,
    schema,
    fields,
    tabFields,
    refetchData,
    refetchOne,
    maxWidth = 'md',
    ActionButtons,
    open,
    rowKey,
    beautyView,
  } = props;
  const defaultValues = useMemo(() => {
    return (
      props.defaultValues ||
      convertFieldsToValues(
        fields || tabFields?.flatMap((tab) => tab.fields) || [],
      )
    );
  }, [fields, props.defaultValues, tabFields]);

  const formRef = useRef<HTMLFormElement>(null);

  const { t } = useTranslation();

  const { enqueueSnackbar } = useSnackbar();

  const form = useForm({
    mode: 'onChange',
    resolver: schema ? yupResolver(schema) : undefined,
  });
  const { handleSubmit, reset, setValue, formState } = form;

  const createOrUpdateMutation = useMutation({
    mutationFn: (data: any) => {
      if (props.submitAction) {
        return props.submitAction(data);
      }

      return service
        ? mode === 'create'
          ? service.create(data, createPath)
          : service.update(data, updatePath)
        : Promise.reject();
    },
    onMutate: () => {
      appService.showLoadingModal();
    },
    onSettled: () => {
      appService.hideLoadingModal();
    },
    onSuccess: () => {
      refetchData && refetchData();
      refetchOne && refetchOne();

      reset({}, { keepValues: false, keepDefaultValues: false });

      onClose();

      enqueueSnackbar(
        t(mode === 'create' ? 'Tạo thành công' : 'Cập nhật thành công'),
        {
          variant: 'success',
        },
      );
    },
    onError: () => {
      enqueueSnackbar(
        t(mode === 'create' ? 'Tạo thất bại' : 'Cập nhật thất bại'),
        {
          variant: 'error',
        },
      );
    },
  });

  const onClose = useCallback(() => {
    props.onClose();
    reset();
  }, [props, reset]);

  const onSubmit = useCallback(
    (data: any) => {
      createOrUpdateMutation.mutate(data);
      reset();
    },
    [createOrUpdateMutation, reset],
  );

  useEffect(() => {
    Object.keys(defaultValues).forEach((key) => {
      !!defaultValues[key] && setValue(key, defaultValues[key]);
    });
    reset(open ? defaultValues : undefined, {
      keepValues: true,
      keepDefaultValues: false,
    });
  }, [defaultValues, open, reset, setValue]);

  useUpdateEffect(() => {
    reset(defaultValues, {
      keepValues: false,
      keepDefaultValues: true,
    });
  }, [defaultValues[rowKey || 'id']]);

  return (
    <DialogExtend
      open={open}
      maxWidth={maxWidth}
      disableEscapeKeyDown
      onClose={(_e, reason) => {
        if (reason) return;
        onClose();
      }}
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent sx={{ minHeight: 400 }}>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
            <BaseCrudFormContainer
              mode={mode}
              fields={fields}
              tabFields={tabFields}
              beautyView={beautyView}
              sx={{ pt: 1 }}
            />
          </form>
        </FormProvider>

        {/* <RhfDevTool control={control} /> */}
      </DialogContent>

      <DialogActions
        sx={{
          position: 'sticky',
          marginTop: 'auto',
          alignSelf: 'flex-end',
          bottom: 0,
        }}
      >
        {mode === 'view' && (
          <Button variant="text" color="inherit" onClick={onClose}>
            {t('Đóng')}
          </Button>
        )}

        {mode !== 'view' && ActionButtons && ActionButtons}

        {mode !== 'view' && !ActionButtons && (
          <>
            <Button
              disabled={
                !formState.isValid ||
                createOrUpdateMutation.isLoading ||
                formState.isSubmitting
              }
              variant="contained"
              onClick={() => {
                formRef.current?.dispatchEvent(
                  new Event('submit', { cancelable: true, bubbles: true }),
                );
              }}
            >
              {t('Lưu')}
            </Button>
            <Button variant="text" color="inherit" onClick={onClose}>
              {t('Hủy')}
            </Button>
          </>
        )}
      </DialogActions>
    </DialogExtend>
  );
};

export default BaseCrudFormModal;
