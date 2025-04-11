import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';

import BaseCrudFormContainer from '@/base/base-crud-form-container';
import PasswordField from '@/base/password-field';
import useLoading from '@/hooks/use-loading';
import useTranslation from '@/hooks/use-translation';

import changePasswordService from '../_services/change-password.service';

const SecurityForm = () => {
  const { t } = useTranslation();

  const { enqueueSnackbar } = useSnackbar();

  const schema = useMemo(
    () =>
      yup.object().shape({
        currentPassword: yup.string().required(t('field-required')),
        newPassword: yup
          .string()
          .required(t('field-required')),
        confirmPassword: yup
          .string()
          .equals([yup.ref('newPassword')], t('Mật khẩu không trùng khớp')),
      }),
    [t],
  );

  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    resolver: yupResolver(schema),
  });
  const { handleSubmit, formState, reset } = methods;

  const updatePasswordMutation = useMutation({
    mutationFn: (data: any) =>
      changePasswordService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    onSuccess: () => {
      reset();
      enqueueSnackbar(t('Đổi mật khẩu thành công'), { variant: 'success' });
    },
    onError: () =>
      enqueueSnackbar(t('Cập nhật thất bại'), { variant: 'error' }),
  });

  useLoading({
    showConditionsSome: [updatePasswordMutation.isLoading],
    hideConditionsEvery: [!updatePasswordMutation.isLoading],
  });

  return (
    <Card sx={{ p: 2, height: '100%' }}>
      <form
        onSubmit={handleSubmit((data) => {
          updatePasswordMutation.mutate(data);
        })}
      >
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6" color="primary.main">
            {t('Bảo mật')}
          </Typography>

          <Button
            variant="soft"
            type="submit"
            disabled={
              !formState.isValid ||
              formState.isSubmitting ||
              updatePasswordMutation.isLoading
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
                name: 'currentPassword',
                label: t('Mật khẩu hiện tại'),
                type: 'custom',
                Component: PasswordField,
              },
              {
                name: 'newPassword',
                label: t('Mật khẩu mới'),
                type: 'custom',
                Component: PasswordField,
              },
              {
                name: 'confirmPassword',
                label: t('Nhập lại mật khẩu mới'),
                type: 'custom',
                Component: PasswordField,
              },
            ]}
          />
        </FormProvider>
      </form>
    </Card>
  );
};

export default SecurityForm;
