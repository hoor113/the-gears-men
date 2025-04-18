import Grid from '@mui/material/Unstable_Grid2/Grid2';

import BaseBasicPage from '@/base/base-basic-page';
import useAuth from '@/hooks/use-auth';
import useTranslation from '@/hooks/use-translation';

import BasicInfoForm from './_components/basic-info-form';

const MyAccountPage = () => {
  const { t } = useTranslation();

  const authQuery = useAuth();

  return (
    <BaseBasicPage name="my-account" title={t('Tài khoản của tôi')}>
      {authQuery.data && (
        <Grid container spacing={2} sx={{ height: 'calc(100% - 50px)' }}>
          <Grid xs={12} md={12} sx={{ height: '100%', overflow: 'hidden' }}>
            <BasicInfoForm authQuery={authQuery} />
          </Grid>
        </Grid>
      )}
    </BaseBasicPage>
  );
};

export default MyAccountPage;
