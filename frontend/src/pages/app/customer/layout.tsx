import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import useAuth from '@/hooks/use-auth';
import { EUserRole } from '@/services/auth/auth.model';

import CustomerTopNav from './_components/customer-top-nav';
import CartProvider from './cart/context/cart.context';

const StyledWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100dvh',
  backgroundColor: '#f5f5f5',
});

const CustomerLayout = () => {
  const navigate = useNavigate();
  const authQuery = useAuth();
  useEffect(() => {
    if (authQuery.isSuccess && authQuery.data?.role !== EUserRole.Customer) {
      navigate(`/`);
    }
  }, [authQuery.isSuccess, authQuery.data, navigate]);

  return authQuery.isSuccess ? (
    <CartProvider>
      <StyledWrapper>
        <CustomerTopNav />
        <Outlet />
      </StyledWrapper>
    </CartProvider>
  ) : (
    <></>
  );
};

export default CustomerLayout;
