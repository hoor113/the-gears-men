import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Link, Stack, TextField, Typography, Tabs, Tab } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import LoadingButton from '@/components/button/loading-button';
import PasswordInput from '@/components/field/password-input';
import SelectChangeLocale from '@/components/field/select-change-locale';
import useTranslation from '@/hooks/use-translation';
import i18n from '@/i18n';
import appService from '@/services/app/app.service';
import { IRegisterInput } from '@/services/auth/auth.model';
import authService from '@/services/auth/auth.service';

const registerSchema = yup.object({
    name: yup.string().required(i18n.t('userNameOrEmailAddress-required')),
    email: yup.string().required(i18n.t('email-required')),
    userName: yup.string().required(i18n.t('userName-required')),
    password: yup.string().required(i18n.t('password-required')),
    confirmPassword: yup
        .string()
        .equals([yup.ref('password')], i18n.t('Mật khẩu không trùng khớp')),
});

const RegisterPage = () => {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const [selectedRole, setSelectedRole] = useState(2); // Default là "Nhân viên" (roleId = 2)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registerSchema),
        mode: 'onChange',
    });

    const { mutate, isLoading: loginLoading } = useMutation({
        mutationFn: (data: IRegisterInput) => authService.register(data),
        onSuccess: () => {
            appService.hideLoadingModal();
            enqueueSnackbar(t('Đăng ký thành công'), { variant: 'success' });
            window.location.href = '/auth/login';
        },
        onError: (err: any) => {
            appService.hideLoadingModal();
            console.log(err);
            enqueueSnackbar(
                err.response.data.message || t('Đã có lỗi xảy ra'),
                {
                    variant: 'error',
                },
            );
        },
    });

    const onSubmit = (data: Partial<IRegisterInput>) => {
        mutate({
            name: data.name!,
            email: data.email!,
            userName: data.userName!,
            password: data.password!,
            roleId: selectedRole,
        }); // Gán roleId theo tab đã chọn
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

                    {/* Tabs để chọn role */}
                    <Tabs
                        value={selectedRole}
                        onChange={(_, newValue) => setSelectedRole(newValue)}
                        centered
                        sx={{ marginBottom: 3 }}
                    >
                        <Tab label={t('STAFF')} value={2} />
                        <Tab label={t('USER')} value={3} />
                    </Tabs>

                    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            fullWidth
                            label={t('Tên người dùng')}
                            error={!!errors.name?.message}
                            helperText={errors.name?.message}
                            disabled={loginLoading}
                            required
                            margin="dense"
                            style={{ marginBottom: 12 }}
                            {...register('name')}
                        />
                        <TextField
                            fullWidth
                            label={t('Họ và tên')}
                            error={!!errors.name?.message}
                            helperText={errors.name?.message}
                            disabled={loginLoading}
                            required
                            margin="dense"
                            style={{ marginBottom: 12 }}
                            {...register('userName')}
                        />
                        <TextField
                            fullWidth
                            label={t('Email')}
                            error={!!errors.name?.message}
                            helperText={errors.name?.message}
                            disabled={loginLoading}
                            required
                            margin="dense"
                            style={{ marginBottom: 12 }}
                            {...register('email')}
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

                        <Typography color="text.secondary" variant="subtitle2" sx={{ marginTop: 2 }}>
                            {t('Đã có tài khoản')}{'? '}
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
