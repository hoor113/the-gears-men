import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import appService from '@/services/app/app.service';
import { AuthContext } from '@/services/auth/auth.context';
// hoặc next/link nếu dùng Next.js
import { ILoginInput } from '@/services/auth/auth.model';
import authService from '@/services/auth/auth.service';

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [, dispatch] = useContext(AuthContext);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { mutate } = useMutation({
    mutationFn: (data: ILoginInput) => authService.login(data),
    onSuccess: (data) => {
      dispatch({ type: 'setIsAuth', payload: true });
      dispatch({ type: 'setCurrentUser', payload: data });

      appService.hideLoadingModal();
      enqueueSnackbar('Đăng nhập thành công', { variant: 'success' });

      queryClient.refetchQueries({ queryKey: ['auth/getUserInfo'] });
    },
    onError: (err: any) => {
      appService.hideLoadingModal();
      enqueueSnackbar(err.response.data.message || 'Đã có lỗi xảy ra', {
        variant: 'error',
      });
    },
  });

  const onSubmit = (data: ILoginInput) => {
    mutate(data);
    appService.showLoadingModal();
  };

  const toggleShowPassword = () => setShowPassword((show) => !show);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-yellow-100 to-orange-200 px-4">
      <div className="absolute w-80 h-80 bg-orange-300 opacity-30 rounded-full blur-3xl animate-pulse -z-10 top-10 left-10"></div>

      <Card className="w-full max-w-md shadow-xl rounded-2xl animate-fade-in transition-all duration-500 hover:shadow-2xl z-10">
        <CardContent>
          <Box className="mb-8 text-center">
            <Typography variant="h4" className="text-orange-600 font-bold">
              Đăng nhập
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Box>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                {...register('email', { required: 'Vui lòng nhập email' })}
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
            </Box>

            <Box>
              <TextField
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                {...register('password', {
                  required: 'Vui lòng nhập mật khẩu',
                })}
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
                      <IconButton
                        onClick={toggleShowPassword}
                        edge="end"
                        aria-label={
                          showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'
                        }
                      >
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
            </Box>

            <CardActions className="pt-2">
              <Button
                type="submit"
                variant="contained"
                fullWidth
                className="!bg-orange-500 hover:!bg-orange-600 text-white font-semibold py-2 rounded-lg transition-all duration-300"
              >
                Đăng nhập
              </Button>
            </CardActions>
          </form>
        </CardContent>

        <Box className="text-center text-sm text-gray-600 pb-5 px-4">
          Chưa có tài khoản?{' '}
          <Link
            to="/auth/register"
            className="text-orange-500 hover:underline font-medium"
          >
            Đăng ký ngay
          </Link>
        </Box>
      </Card>
    </div>
  );
};

export default LoginPage;
