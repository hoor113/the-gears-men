import NiceModal from '@ebay/nice-modal-react';
import { Avatar, Box, Button, Card, Stack, Typography } from '@mui/material';
import { UseQueryResult, useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import ImageCropperModal from '@/base/image-cropper-modal';
import useLoading from '@/hooks/use-loading';
import { IUserInfo } from '@/services/auth/auth.model';

import myAccountService from '../_services/my-account.service';

type TAvatarFormProps = {
    authQuery: UseQueryResult<IUserInfo, unknown>;
};

const AvatarForm = ({ authQuery }: TAvatarFormProps) => {
    const { t } = useTranslation();

    const inputAvatarRef = useRef<HTMLInputElement>(null);

    const { enqueueSnackbar } = useSnackbar();

    const uploadAvatarMutation = useMutation({
        mutationFn: (file: File) =>
            myAccountService.uploadAvatar(file, authQuery.data),
        onError: () => enqueueSnackbar(t('Đã có lỗi xảy ra'), { variant: 'error' }),
        onSuccess: async () => {
            await authQuery.refetch();

            enqueueSnackbar(t('Cập nhật thành công'), {
                variant: 'success',
            });
        },
    });

    useLoading({
        showConditionsSome: [uploadAvatarMutation.isLoading],
        hideConditionsEvery: [!uploadAvatarMutation.isLoading],
    });

    return (
        <Card
            sx={{
                p: 2,
                height: '100%',
            }}
        >
            <Typography variant="h6" color="primary.main">
                {t('Ảnh đại diện')}
            </Typography>

            <Box sx={{ my: 3 }} />

            <Stack justifyContent="center" alignItems="center" spacing={2}>
                <Avatar
                    src={authQuery.data?.avatarPicture}
                    alt={authQuery.data?.fullname}
                    sx={(theme) => ({
                        height: theme.spacing(24),
                        width: theme.spacing(24),
                        mb: 2,
                    })}
                />

                <input
                    ref={inputAvatarRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(event) => {
                        if (event.target.files?.[0]) {
                            NiceModal.show(ImageCropperModal, {
                                image: event.target.files?.[0],
                                onChange: (file) => {
                                    if (file) {
                                        uploadAvatarMutation.mutate(file as File);
                                    }
                                },
                            });
                        }
                    }}
                />

                <Button
                    variant="dashed"
                    onClick={() => {
                        inputAvatarRef.current?.click();
                    }}
                >
                    {t('Cập nhật ảnh đại diện')}
                </Button>
            </Stack>
        </Card>
    );
};

export default AvatarForm;
