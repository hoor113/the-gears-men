import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, Stack, Typography } from '@mui/material';
import { UseQueryResult, useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import * as R from 'rambda';
import { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';

import BaseCrudFormContainer from '@/base/base-crud-form-container';
import useLoading from '@/hooks/use-loading';
import useTranslation from '@/hooks/use-translation';
import { IUserInfo } from '@/services/auth/auth.model';

import myAccountService from '../_services/my-account.service';

type TBasicInfoFormProps = {
  authQuery: UseQueryResult<IUserInfo, unknown>;
};

const BasicInfoForm = ({ authQuery }: TBasicInfoFormProps) => {
  const { t } = useTranslation();

  const defaultData = useMemo(
    () => ({
      name: authQuery.data?.name,
      userName: authQuery.data?.userName,
      email: authQuery.data?.email,
    }),
    [authQuery.data],
  );

  const { enqueueSnackbar } = useSnackbar();

  const schema = useMemo(
    () =>
      yup.object().shape({
        name: yup.string().required(t('field-required')),
        userName: yup.string().required(t('field-required')),
        email: yup
          .string()
          .email(t('Email không hợp lệ'))
          .required(t('field-required')),
      }),
    [t],
  );

  const methods = useForm({
    defaultValues: {
      name: '',
      userName: '',
      email: '',
    },
    resolver: yupResolver(schema),
  });

  const updateBasicMutation = useMutation({
    mutationFn: (data: Partial<IUserInfo>) => {
      if (!authQuery.data?.id) {
        throw new Error('User ID is undefined');
      }
      return myAccountService.updateInfo({ id: authQuery.data.id }, data);
    },
    onSuccess: async () => {
      await authQuery.refetch();
      enqueueSnackbar(t('Cập nhật thành công'), { variant: 'success' });
    },
    onError: () =>
      enqueueSnackbar(t('Cập nhật thất bại'), { variant: 'error' }),
  });

  useLoading({
    showConditionsSome: [updateBasicMutation.isLoading, authQuery.isLoading],
    hideConditionsEvery: [!updateBasicMutation.isLoading, !authQuery.isLoading],
  });

  useEffect(() => {
    methods.reset(defaultData);
  }, [authQuery.data, methods, defaultData]);

  console.log(!methods.formState.isValid, methods.formState.isSubmitting, updateBasicMutation.isLoading, R.equals(defaultData, methods.watch() as any));
  return (
    <Card sx={{ p: 2, height: '100%' }}>
      <form
        onSubmit={methods.handleSubmit((data) => {
          updateBasicMutation.mutate(data);
        })}
      >
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6" color="primary.main">
            {t('Thông tin cơ bản')}
          </Typography>

          <Button
            variant="soft"
            type="submit"
            disabled={
              !methods.formState.isValid ||
              methods.formState.isSubmitting ||
              updateBasicMutation.isLoading ||
              R.equals(defaultData, methods.watch() as any)
            }
          >
            {t('Lưu')}
          </Button>
        </Stack>

        <Box sx={{ my: 2 }} />

        <FormProvider {...methods}>
          <BaseCrudFormContainer
            fields={[
              {
                name: 'name',
                label: t('Tên đăng nhập'),
                type: 'text',
                readOnly: true,
              },
              {
                name: 'userName',
                label: t('Họ tên'),
                type: 'text',
                required: true,
              },
              {
                name: 'email',
                label: t('E-mail'),
                type: 'text',
                required: true,
              },
            ]}
          />
        </FormProvider>
      </form>
    </Card>
  );
};

export default BasicInfoForm;
