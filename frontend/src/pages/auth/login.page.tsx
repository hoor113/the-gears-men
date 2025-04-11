/* eslint-disable no-extra-boolean-cast */
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Link, Stack, TextField, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import LoadingButton from '@/components/button/loading-button';
import PasswordInput from '@/components/field/password-input';
import SelectChangeLocale from '@/components/field/select-change-locale';
import useTranslation from '@/hooks/use-translation';
import i18n from '@/i18n';
import appService from '@/services/app/app.service';
import { AuthContext } from '@/services/auth/auth.context';
import { ILoginInput } from '@/services/auth/auth.model';
import authService from '@/services/auth/auth.service';

const loginSchema = yup.object({
  name: yup
    .string()
    .required(i18n.t('userNameOrEmailAddress-required')),
  password: yup.string().required(i18n.t('password-required')),
});

const LoginPage = () => {
  const [, dispatch] = useContext(AuthContext);

  const { t } = useTranslation();

  const { enqueueSnackbar } = useSnackbar();

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
  });

  const { mutate, isLoading: loginLoading } = useMutation({
    mutationFn: (data: ILoginInput) => authService.login(data),
    onSuccess: (data) => {
      dispatch({ type: 'setIsAuth', payload: true });
      dispatch({ type: 'setCurrentUser', payload: data });

      appService.hideLoadingModal();
      enqueueSnackbar(t('Đăng nhập thành công'), { variant: 'success' });

      queryClient.refetchQueries({ queryKey: ['auth/getUserInfo'] });
    },
    onError: (err: any) => {
      appService.hideLoadingModal();
      enqueueSnackbar(
        err.response.data.message || t('Đã có lỗi xảy ra'),
        {
          variant: 'error',
        },
      );
    },
  });

  const onSubmit = (data: ILoginInput) => {
    mutate(data);
    appService.showLoadingModal();
  };

  return (
    <Box
      sx={{
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'background.paper',
        flex: '1 1 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url('https://i.imgur.com/0pL1DHx.png')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
          zIndex: 0,
        }}
      ></Box>
      <Box
        sx={{
          maxWidth: 550,
          px: 3,
          pt: 4,
          pb: 6,
          width: '100%',
          backgroundColor: 'background.paper',
          borderRadius: 1,
          zIndex: 1,
          position: 'relative',
        }}
      >
        <div>
          <Stack
            spacing={1}
            sx={{
              mb: 3,
              position: 'relative',
              '.btn-locale': {
                position: 'absolute',
                top: 0,
                right: 0,
                mt: 0,
              },
            }}
          >
            <Typography variant="h4">{t('Đăng nhập')}</Typography>
            <Typography color="text.secondary" variant="subtitle2">
              {t('Chưa có tài khoản') + '? '}
              <Link href="/auth/register" underline="hover" variant="subtitle2">
                {t('Đăng ký ngay')}
              </Link>
            </Typography>
            <SelectChangeLocale
              buttonProps={{
                className: 'btn-locale',
                size: 44,
                style: {
                  fontSize: 26,
                },
              }}
            />
          </Stack>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label={t('Tên người dùng hoặc Email')}
              error={!!errors.name?.message}
              helperText={errors.name?.message}
              disabled={loginLoading}
              required
              margin="dense"
              style={{ marginBottom: 12 }}
              {...register('name')}
            />
            <PasswordInput
              fullWidth
              label={t('Mật khẩu')}
              error={!!errors.password?.message}
              helperText={errors.password?.message}
              disabled={loginLoading}
              required
              margin="dense"
              style={{ marginBottom: 12 }}
              {...register('password')}
            />
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={loginLoading}
            >
              {t('Đăng nhập')}
            </LoadingButton>
          </form>
        </div>
      </Box>
    </Box>
  );
};

export default LoginPage;
