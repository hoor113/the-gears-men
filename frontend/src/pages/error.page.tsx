import { Button, Container, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import useTranslation from '@/hooks/use-translation';

const ErrorPage = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  return (
    <Container sx={{ height: '100vh', pb: 10 }}>
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ height: '100%' }}
        spacing={4}
      >
        <img src="/assets/images/error.png" alt="error" width="400" />

        <Stack alignItems="center" spacing={1}>
          <Typography variant="h4">{t('Đã có lỗi xảy ra')}</Typography>
          <Typography variant="body1" color="GrayText">
            {t('Liên hệ quản trị viên để được hỗ trợ')}
          </Typography>
        </Stack>

        <Button onClick={() => navigate('/')}>{t('Quay lại')}</Button>
      </Stack>
    </Container>
  );
};

export default ErrorPage;
