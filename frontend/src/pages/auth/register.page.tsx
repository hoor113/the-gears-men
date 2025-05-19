import { yupResolver } from '@hookform/resolvers/yup';
import {
  Badge,
  DirectionsCar,
  Email,
  Home,
  Lock,
  Person,
  Phone,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

import appService from '@/services/app/app.service';
import { EUserRole } from '@/services/auth/auth.model';
import authService from '@/services/auth/auth.service';

type RegisterFormData = {
  username: string;
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: EUserRole;
  phoneNumber: string;
  addresses: string;
  vehicleLicenseNumber?: string;
};

const userRoles = [
  { label: 'Khách hàng', value: EUserRole.Customer },
  { label: 'Nhân viên giao hàng', value: EUserRole.DeliveryPersonnel },
  { label: 'Công ty giao hàng', value: EUserRole.DeliveryCompany },
  { label: 'Chủ cửa hàng', value: EUserRole.StoreOwner },
];

const schema = yup.object({
  username: yup.string().required('Vui lòng nhập tên đăng nhập'),
  fullname: yup.string().required('Vui lòng nhập họ tên'),
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Vui lòng nhập email'),
  password: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Vui lòng nhập mật khẩu'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Mật khẩu nhập lại không khớp')
    .required('Vui lòng nhập lại mật khẩu'),
  role: yup.mixed<EUserRole>().required('Vui lòng chọn vai trò'),
  phoneNumber: yup
    .string()
    .required('Vui lòng nhập số điện thoại')
    .matches(/^(0|\+84)[0-9]{9,10}$/, 'Số điện thoại không hợp lệ'),
  addresses: yup.string().required('Vui lòng nhập địa chỉ'),
  vehicleLicenseNumber: yup.string().when('role', {
    is: EUserRole.DeliveryPersonnel,
    then: (schema) => schema.required('Vui lòng nhập biển số xe'),
    otherwise: (schema) => schema.optional(),
  }),
});

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const { mutate } = useMutation({
    mutationFn: (data: any) => authService.register(data),
    onSuccess: () => {
      enqueueSnackbar('Đăng ký thành công', { variant: 'success' });
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 5000);
      appService.hideLoadingModal();
    },
    onError: (err: any) => {
      enqueueSnackbar(err?.response?.data?.message || 'Đã có lỗi xảy ra', {
        variant: 'error',
      });
      appService.hideLoadingModal();
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    const finalData = {
      ...data,
      addresses: data.addresses
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
    };

    mutate(finalData);
    appService.showLoadingModal();
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const selectedRole = watch('role');

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-yellow-100 to-orange-200 px-4">
      <div className="absolute w-80 h-80 bg-orange-300 opacity-30 rounded-full blur-3xl animate-pulse -z-10 top-10 left-10"></div>

      <Card className="w-full max-w-4xl shadow-xl rounded-2xl animate-fade-in transition-all duration-500 hover:shadow-2xl z-10">
        <CardContent>
          <Box className="mb-8 text-center">
            <Typography variant="h4" className="text-orange-600 font-bold">
              Đăng ký
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Tên đăng nhập *"
                  fullWidth
                  {...register('username')}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person className="text-orange-500" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Họ và tên *"
                  fullWidth
                  {...register('fullname')}
                  error={!!errors.fullname}
                  helperText={errors.fullname?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Badge className="text-orange-500" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Email *"
                  fullWidth
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email className="text-orange-500" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Số điện thoại *"
                  fullWidth
                  {...register('phoneNumber')}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone className="text-orange-500" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Mật khẩu *"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock className="text-orange-500" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={toggleShowPassword} edge="end">
                          {showPassword ? (
                            <VisibilityOff className="text-orange-500" />
                          ) : (
                            <Visibility className="text-orange-500" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Nhập lại mật khẩu *"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  {...register('confirmPassword')}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock className="text-orange-500" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Địa chỉ (nhiều địa chỉ ngăn cách bằng dấu phẩy)"
                  fullWidth
                  {...register('addresses')}
                  error={!!errors.addresses}
                  helperText={errors.addresses?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Home className="text-orange-500" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Vai trò "
                  fullWidth
                  select
                  {...register('role')}
                  error={!!errors.role}
                  helperText={errors.role?.message}
                >
                  {userRoles.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {selectedRole === EUserRole.DeliveryPersonnel && (
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Biển số xe "
                    fullWidth
                    {...register('vehicleLicenseNumber')}
                    error={!!errors.vehicleLicenseNumber}
                    helperText={errors.vehicleLicenseNumber?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DirectionsCar className="text-orange-500" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              )}
            </Grid>

            <CardActions className="pt-6">
              <Button
                type="submit"
                variant="contained"
                fullWidth
                className="!bg-orange-500 hover:!bg-orange-600 text-white font-semibold py-2 rounded-lg transition-all duration-300"
              >
                Đăng ký
              </Button>
            </CardActions>
          </form>
        </CardContent>

        <Box className="text-center text-sm text-gray-600 pb-5 px-4">
          Đã có tài khoản?{' '}
          <Link
            to="/auth/login"
            className="text-orange-500 hover:underline font-medium"
          >
            Đăng nhập
          </Link>
        </Box>
      </Card>
    </div>
  );
};

export default RegisterPage;
