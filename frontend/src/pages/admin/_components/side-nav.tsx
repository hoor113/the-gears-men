import {
  CategorySharp,
  MenuOpenTwoTone as OpenMenuIcon,
  PublishedWithChangesRounded,
  SettingsTwoTone,
  BookTwoTone as BookIcon,
  GroupTwoTone as GroupIcon,
  Person2TwoTone as PersonIcon,
  ReceiptLongTwoTone as ReceiptIcon,
  PaidTwoTone as PaidIcon,
  HandshakeTwoTone as RequestIcon,
} from '@mui/icons-material';
import {
  Box,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import * as R from 'rambda';
import { useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Logo from '@/components/logo';
import Scrollbar from '@/components/scrollbar';
import { ADMIN_LAYOUT, APP_NAME } from '@/configs/constant.config';
import { ALL_PERMISSIONS } from '@/configs/permissions.constant';
import useTranslation from '@/hooks/use-translation';
import { AbpContext } from '@/services/abp/abp.context';

import SideNavItem from './side-nav-item';

type TSideNavItem = {
  title: string;
  path?: string;
  basePath?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ReactNode;
  children?: TSideNavItem[];
  permissions?: string[];
};

type TSideNavProps = {
  tenantName?: string;
  open: boolean;
  onClose: () => void;
  openNavLg: boolean;
  setOpenNavLg: (_open: boolean) => void;
};

const checkPermission = (
  grantedPermissions: string[],
  permissions?: string[],
) => {
  if (permissions?.length === 0) return true;

  return R.intersection(grantedPermissions, permissions || []).length > 0;
};

const SideNav = (props: TSideNavProps) => {
  const { open, onClose, openNavLg, setOpenNavLg } = props;

  const { t } = useTranslation();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [abpState] = useContext(AbpContext);

  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'));

  const items = useMemo<TSideNavItem[]>(
    () => [
      {
        icon: <PublishedWithChangesRounded />,
        title: t('Danh sách nhà xuất bản'),
        path: '/publishers',
        permissions: [ALL_PERMISSIONS.Publisher_Admin],
      },
      {
        icon: <PersonIcon />,
        title: t('Danh sách tác giả'),
        path: '/authors',
        permissions: [ALL_PERMISSIONS.Author_Admin],
      },
      {
        icon: <CategorySharp />,
        title: t('Danh sách thể loại'),
        path: '/categories',
        permissions: [ALL_PERMISSIONS.Category_Admin],
      },
      {
        title: t('Quản lý sách'),
        path: '/books',
        icon: <BookIcon />,
        permissions: [ALL_PERMISSIONS.Book_Create],
      },
      {
        title: t('Quản lý mượn trả sách'),
        path: '/bookLoans',
        icon: <ReceiptIcon />,
        permissions: [ALL_PERMISSIONS.BookLoan_Admin],
      },
      {
        title: t('Quản lý phạt'),
        path: '/fines',
        icon: <PaidIcon />,
        permissions: [ALL_PERMISSIONS.Fine_Admin],
      },
      {
        title: t('Danh mục sách'),
        path: '/client/books',
        icon: <BookIcon />,
        permissions: [ALL_PERMISSIONS.Book_Client],
      },
      {
        title: t('Danh mục sách mượn'),
        path: '/client/bookLoans',
        icon: <ReceiptIcon />,
        permissions: [ALL_PERMISSIONS.BookLoan_Client],
      },
      {
        title: t('Danh sách yêu cầu đã tạo'),
        path: '/client/bookRequests',
        icon: <RequestIcon />,
        permissions: [ALL_PERMISSIONS.BookRequest_Client],
      },
      {
        title: t('Danh sách hình phạt'),
        path: '/client/fines',
        icon: <PaidIcon />,
        permissions: [ALL_PERMISSIONS.Fine_Client]
      },
      {
        title: t('Quản trị'),
        basePath: '/system',
        icon: <GroupIcon />,
        permissions: [ALL_PERMISSIONS.User_GetAll],
        children: [
          {
            title: t('Vai trò'),
            path: '/system/roles',
            permissions: [ALL_PERMISSIONS.Role_Update],
          },
          {
            title: t('Danh sách người dùng'),
            path: '/system/accounts',
            permissions: [ALL_PERMISSIONS.User_GetAll],
          },
          {
            title: t('Danh sách nhân viên'),
            path: '/system/staffs',
            permissions: [ALL_PERMISSIONS.Staff_GetAll],
          }
        ]
      },
      {
        title: t('Cài đặt'),
        basePath: '/settings',
        icon: <SettingsTwoTone />,
        children: [
          {
            title: t('Tài khoản của tôi'),
            path: '/settings/my-account',
            permissions: [],
          },
          {
            title: t('Đổi mật khẩu'),
            path: '/settings/change-password',
            permissions: [],
          }
        ],
      },
    ],
    [t],
  );

  const content = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%',
        },
        '& .simplebar-scrollbar:before': {
          background: 'grey.400',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          sx={{
            px: 1,
            cursor: 'pointer',
            boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
          }}
          onClick={() => navigate('/')}
        >
          <Box
            sx={{
              display: 'inline-flex',
            }}
          >
            <Logo />
          </Box>

          <Typography
            variant="h5"
            sx={(theme) => ({
              transition: theme.transitions.create('color'),
              ':hover': {
                color: theme.palette.primary.light,
              },
            })}
          >
            {APP_NAME}
          </Typography>
        </Box>

        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 1,
            py: 1,
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: 'none',
              p: 0,
              m: 0,
            }}
          >
            {items
              .filter(
                (item) =>
                  checkPermission(abpState.permissions, item.permissions) ||
                  item.children?.some((child) =>
                    checkPermission(abpState.permissions, child.permissions),
                  ),
              )
              .map((item, index) => {
                const active = item.path
                  ? pathname === item.path
                  : item.basePath
                    ? item?.children?.some((child) => pathname === child.path)
                    : false;

                return (
                  <SideNavItem
                    active={active}
                    disabled={item.disabled || false}
                    external={item.external || false}
                    icon={item.icon}
                    key={index}
                    path={item.path}
                    title={item.title}
                    itemChildren={item?.children
                      ?.filter((child) =>
                        checkPermission(
                          abpState.permissions,
                          child.permissions,
                        ),
                      )
                      ?.map((child) => ({
                        active: false,
                        disabled: child.disabled || false,
                        external: child.external || false,
                        icon: child.icon,
                        path: child.path,
                        title: child.title,
                        itemChildren: child?.children,
                      }))}
                  />
                );
              })}
          </Stack>
        </Box>
      </Box>
    </Scrollbar>
  );

  if (lgUp) {
    return (
      <Box>
        <IconButton
          sx={{
            position: 'fixed',
            left: openNavLg ? 244 : 24,
            top: 12,
            zIndex: (theme) => theme.zIndex.appBar + 101,
          }}
          onClick={() => setOpenNavLg(!openNavLg)}
        >
          {openNavLg ? (
            <OpenMenuIcon />
          ) : (
            <OpenMenuIcon sx={{ transform: 'scaleX(-1)' }} />
          )}
        </IconButton>
        <Drawer
          anchor="left"
          open={openNavLg}
          onClose={() => setOpenNavLg(false)}
          PaperProps={{
            sx: {
              backgroundColor: '#051e34',
              color: theme.palette.common.white,
              width: ADMIN_LAYOUT.SIDE_NAV_WIDTH,
              backgroundImage: `url('/assets/images/nav_nachos_2x.png')`,
              backgroundPosition: 'left 0 bottom 0',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '300px 556px',
            },
          }}
          variant="persistent"
        >
          {content}
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.grey[900],
          color: theme.palette.common.white,
          width: ADMIN_LAYOUT.SIDE_NAV_WIDTH,
        },
        elevation: 2,
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

export default SideNav;
