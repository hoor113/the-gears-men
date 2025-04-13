import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import useAuth from '@/hooks/use-auth';
import { EUserRole } from '@/services/auth/auth.model';

const StyledWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100dvh',
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
    <StyledWrapper>
      <Outlet />
    </StyledWrapper>
  ) : (
    <></>
  );
};

export default OwnerLayout;
