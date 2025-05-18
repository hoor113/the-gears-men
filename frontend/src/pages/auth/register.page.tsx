import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Link,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import LoadingButton from '@/components/button/loading-button';
import PasswordInput from '@/components/field/password-input';
import SelectChangeLocale from '@/components/field/select-change-locale';
import useTranslation from '@/hooks/use-translation';
import i18n from '@/i18n';
import appService from '@/services/app/app.service';
import { IRegisterInput } from '@/services/auth/auth.model';
import { EUserRole } from '@/services/auth/auth.model';
import authService from '@/services/auth/auth.service';

const registerSchema = yup.object({
  userName: yup.string().required(i18n.t('userNameOrEmailAddress-required')),
  email: yup
    .string()
    .email(i18n.t('email-invalid'))
    .required(i18n.t('email-required')),
  fullName: yup.string().required(i18n.t('fullName-required')),
  password: yup.string().required(i18n.t('password-required')),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], i18n.t('Mật khẩu không trùng khớp'))
    .required(i18n.t('confirmPassword-required')),
  role: yup
    .mixed<EUserRole>()
    .oneOf(Object.values(EUserRole))
    .required(i18n.t('role-required')),
  phoneNumber: yup.string().optional(),
  addresses: yup.array().of(yup.string()).optional(),
  avatarPicture: yup.string().url(i18n.t('avatarPicture-invalid')).optional(),
  vehicleLicenseNumber: yup.string().optional(),
});

const RegisterPage = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      userName: '',
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      addresses: [],
      avatarPicture: '',
      vehicleLicenseNumber: '',
    },
  });

  const role = watch('role');

  const { isLoading: loginLoading } = useMutation({
    mutationFn: (data: IRegisterInput) => authService.register(data),
    onSuccess: () => {
      appService.hideLoadingModal();
      enqueueSnackbar(t('Đăng ký thành công'), { variant: 'success' });
      window.location.href = '/auth/login';
    },
    onError: (err: any) => {
      appService.hideLoadingModal();
      console.log(err);
      enqueueSnackbar(err.response.data.message || t('Đã có lỗi xảy ra'), {
        variant: 'error',
      });
    },
  });

  // const onSubmit = (data: Partial<IRegisterInput>) => {
  //   mutate({
  //     email: data.email!,
  //     userName: data.userName!,
  //     fullName: data.fullName!,
  //     phoneNumber: data.phoneNumber || '',
  //     addresses: data.addresses?.filter(
  //       (address): address is string => !!address,
  //     ),
  //     password: data.password!,
  //     role: role,
  //   }); // Gán roleId theo tab đã chọn
  //   appService.showLoadingModal();
  // };

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
          backgroundColor: 'grey.400',
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
        <Box>
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
            <Typography variant="h4">{t('Đăng ký')}</Typography>
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
          {/* Select để chọn role */}
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {'Chọn vai trò'}
            </Typography>
            <Select
              fullWidth
              value={role || ''}
              onChange={(e) => setValue('role', e.target.value as EUserRole)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                {'Chọn vai trò'}
              </MenuItem>
              {Object.values(EUserRole).map((roleValue) => (
                <MenuItem key={roleValue} value={roleValue}>
                  {(() => {
                    switch (roleValue) {
                      case EUserRole.DeliveryCompany:
                        return 'Công ty vận chuyển';
                      case EUserRole.Customer:
                        return 'Người dùng';
                      case EUserRole.DeliveryPersonnel:
                        return 'Tài xế';
                      default:
                        return 'Người dùng';
                    }
                  })()}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box component="form">
            <TextField
              fullWidth
              label={t('Tên người dùng')}
              error={!!errors.userName?.message}
              helperText={errors.userName?.message}
              disabled={loginLoading}
              required
              margin="dense"
              style={{ marginBottom: 12 }}
              {...register('userName')}
            />
            <TextField
              fullWidth
              label={t('Họ và tên')}
              error={!!errors.fullName?.message}
              helperText={errors.fullName?.message}
              disabled={loginLoading}
              required
              margin="dense"
              style={{ marginBottom: 12 }}
              {...register('userName')}
            />
            <TextField
              fullWidth
              label={t('Email')}
              error={!!errors.email?.message}
              helperText={errors.email?.message}
              disabled={loginLoading}
              required
              margin="dense"
              style={{ marginBottom: 12 }}
              {...register('email')}
            />
            <TextField
              fullWidth
              label={t('Số điện thoại')}
              error={!!errors.phoneNumber?.message}
              helperText={errors.phoneNumber?.message}
              disabled={loginLoading}
              required
              margin="dense"
              style={{ marginBottom: 12 }}
              {...register('phoneNumber')}
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
            <PasswordInput
              fullWidth
              label={t('Nhập lại mật khẩu mới')}
              error={!!errors.confirmPassword?.message}
              helperText={errors?.confirmPassword?.message as any}
              disabled={loginLoading}
              required
              margin="dense"
              style={{ marginBottom: 12 }}
              {...register('confirmPassword')}
            />
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={loginLoading}
            >
              {t('Đăng ký')}
            </LoadingButton>

            <Typography
              color="text.secondary"
              variant="subtitle2"
              sx={{ marginTop: 2 }}
            >
              {t('Đã có tài khoản')}
              {'? '}
              <Link href="/auth/login" underline="hover" variant="subtitle2">
                {t('Đăng nhập')}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterPage;
