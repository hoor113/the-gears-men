import { Box, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { ADMIN_LAYOUT } from '@/configs/constant.config';
import useAuth from '@/hooks/use-auth';
import { EUserRole } from '@/services/auth/auth.model';

import SideNav from '../_components/side-nav';
import { TopNav } from '../_components/top-nav';

const LayoutWrapper = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'openNavLg',
})<{
    openNavLg: boolean;
}>(({ theme, openNavLg }) => ({
    display: 'flex',
    flex: '1 1 auto',
    minHeight: 0,
    maxWidth: '100%',
    flexDirection: 'column',
    backgroundColor: theme.palette.grey[100],
    [theme.breakpoints.up('lg')]: {
        paddingLeft: openNavLg ? ADMIN_LAYOUT.SIDE_NAV_WIDTH : 0,
    },
}));

const StyledWrapper = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    height: '100dvh',
});

const AdminLayout = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [openNav, setOpenNav] = useState(false);
    const [openNavLg, setOpenNavLg] = useState(true);

    const theme = useTheme();
    const lgUp = useMediaQuery(theme.breakpoints.up('lg'));

    const handlePathnameChange = useCallback(() => {
        if (openNav) {
            setOpenNav(false);
        }
    }, [openNav]);

    const authQuery = useAuth();

    useEffect(() => {
        if (authQuery.isSuccess && authQuery.data?.role !== EUserRole.Admin) {
            navigate(`/`);
        }
    }, [authQuery.isSuccess, authQuery.data, navigate]);

    useEffect(() => {
        handlePathnameChange();
    }, [pathname, handlePathnameChange]);

    return authQuery.isSuccess ? (
        <StyledWrapper>
            <TopNav onNavOpen={() => setOpenNav(true)} openNavLg={openNavLg} />
            <SideNav
                open={openNav}
                onClose={() => setOpenNav(false)}
                openNavLg={openNavLg}
                setOpenNavLg={setOpenNavLg}
            />
            <LayoutWrapper openNavLg={lgUp && openNavLg}>
                <Outlet />
            </LayoutWrapper>
        </StyledWrapper>
    ) : (
        <></>
    );
};

export default AdminLayout;
