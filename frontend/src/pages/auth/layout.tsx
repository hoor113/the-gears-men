import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import useAuth from '@/hooks/use-auth';
import appService from '@/services/app/app.service';

const AuthLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const authQuery = useAuth();

  useEffect(() => {
    if (authQuery.isLoading) {
      appService.showLoadingModal();
    }
    if (authQuery.isSuccess || authQuery.isError) {
      setTimeout(() => {
        appService.hideLoadingModal();
      }, 500);
    }
    if (authQuery.isSuccess) {
      navigate(location.state?.from || '/', { replace: true });
    }
  }, [authQuery, location.state?.from, navigate]);

  return <Outlet />;
};

export default AuthLayout;
