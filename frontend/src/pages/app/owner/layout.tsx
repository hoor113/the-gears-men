import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import useAuth from '@/hooks/use-auth';
import { EUserRole } from '@/services/auth/auth.model';

import OwnerTopNav from './_components/owner-top-nav';
import StoreProvider from './store/_services/store.context';

const StyledWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100dvh',
  backgroundColor: '#f5f5f5',
});

const OwnerLayout = () => {
  const navigate = useNavigate();
  const authQuery = useAuth();

  useEffect(() => {
    if (authQuery.isSuccess && authQuery.data?.role !== EUserRole.StoreOwner) {
      navigate(`/`);
    }
  }, [authQuery.isSuccess, authQuery.data, navigate]);

  return authQuery.isSuccess ? (
    <StoreProvider>
      <StyledWrapper>
        <OwnerTopNav />
        <Outlet />
      </StyledWrapper>
    </StoreProvider>
  ) : (
    <></>
  );
};

export default OwnerLayout;
