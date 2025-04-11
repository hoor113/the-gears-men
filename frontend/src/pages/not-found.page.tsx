import { Button, Container, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import useTranslation from '@/hooks/use-translation';

const NotFoundPage = () => {
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
        <img src="/assets/images/error-404.png" alt="404" width="400" />

        <Stack alignItems="center" spacing={1}>
          <Typography variant="h4">{t('not-found/title')}</Typography>
          <Typography variant="body1" color="GrayText">
            {t('not-found/subtitle')}
          </Typography>
        </Stack>

        <Button onClick={() => navigate('/')}>{t('Quay lại')}</Button>
      </Stack>
    </Container>
  );
};

export default NotFoundPage;
