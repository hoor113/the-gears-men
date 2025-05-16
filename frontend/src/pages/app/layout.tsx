import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ComponentType, useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import Scrollbar, { MainScrollbarContext } from '@/components/scrollbar';
import useAbp from '@/hooks/use-abp';
import useAuth from '@/hooks/use-auth';
import AbpProvider from '@/services/abp/abp.context';
import appService from '@/services/app/app.service';
import { EUserRole } from '@/services/auth/auth.model';

const LayoutContainer = styled(Scrollbar)({
  display: 'flex',
  flex: '1 1 auto',
  minHeight: 0,
  flexDirection: 'column',
  width: '100%',
});

const StyledWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100dvh',
});

const AppLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const scrollableNodeRef = useRef<HTMLElement>(null);
  const [openNav, setOpenNav] = useState(false);

  const handlePathnameChange = useCallback(() => {
    if (openNav) {
      setOpenNav(false);
    }
  }, [openNav]);

  const authQuery = useAuth();
  const { abpQuery } = useAbp();

  useEffect(() => {
    if (authQuery.isLoading || abpQuery.isLoading) {
      appService.showLoadingModal();
    }
    if (!authQuery.isLoading && !abpQuery.isLoading) {
      appService.hideLoadingModal();
    }
    if (authQuery.isError) {
      navigate(`/auth/login?redirect=${pathname}`);
    }
  }, [
    abpQuery.isLoading,
    authQuery.isError,
    authQuery.isLoading,
    authQuery.isSuccess,
    navigate,
    pathname,
  ]);

  useEffect(() => {
    const currentRole = authQuery.data?.role;
    if (!currentRole) return;

    // Nếu đã nằm trong đúng nhánh thì không cần redirect nữa
    const shouldRedirect = pathname === '/' || pathname === '/auth/login';

    if (!shouldRedirect) return;
    console.log(authQuery.data?.role, 'role');
    switch (currentRole) {
      case EUserRole.Admin:
        navigate('/admin/');
        break;
      case EUserRole.Customer:
        navigate('/customer/');
        break;
      case EUserRole.DeliveryCompany:
        navigate('/company/');
        break;
      case EUserRole.DeliveryPersonnel:
        navigate('/personnel/');
        break;
      case EUserRole.StoreOwner:
        navigate('/owner/');
        break;
      default:
        navigate('/');
        break;
    }
  }, [authQuery.data?.role, navigate, pathname]);

  useEffect(() => {
    handlePathnameChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return authQuery.isSuccess ? (
    <MainScrollbarContext.Provider value={{ scrollableNodeRef }}>
      <StyledWrapper>
        <LayoutContainer>
          <Outlet />
        </LayoutContainer>
      </StyledWrapper>
    </MainScrollbarContext.Provider>
  ) : (
    <></>
  );
};

const withAbpProvider = (Component: ComponentType<any>) =>
  function WrappedAppLayout(props: any) {
    return (
      <AbpProvider>
        <Component {...props} />
      </AbpProvider>
    );
  };

export default withAbpProvider(AppLayout);
