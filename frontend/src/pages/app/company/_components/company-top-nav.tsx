import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, IconButton, Typography, alpha, styled } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import usePopover from '@/hooks/use-popover';

import AccountPopover from '../../_components/account-popover';
import CompanyLeftDrawer from './left-drawer';

const AvatarStyled = styled(Avatar)(({ theme }) => ({
  border: `1px solid ${alpha(theme.palette.primary.main, 0.6)}`,
  flexShrink: 0,
  height: 45,
  width: 45,
  padding: 2,
  '& > img': {
    borderRadius: '50%',
  },
}));

export default function CompanyTopNav() {
  const navigate = useNavigate();
  const accountPopover = usePopover();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  return (
    <div className="w-full bg-[#ece2df] px-4  md:px-10 py-3 flex justify-between items-center gap-y-3 text-white relative">
      {/* Vùng bên trái (Tiêu đề và Thanh tìm kiếm) */}
      <div className="flex items-center gap-x-4 w-2/3">
        {/* Menu Drawer */}
        <IconButton
          onClick={() => toggleDrawer(true)}
          sx={{ color: '#f97316' }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="a"
          onClick={() => navigate('/')}
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '1rem', md: '1.125rem' },
            color: 'primary.main',
            textDecoration: 'none',
            cursor: 'pointer',
            '& .top-nav-group-name': {
              color: '#FB8C00', // orange-500
            },
          }}
        >
          <span className="top-nav-group-name">The Gears Men</span>
        </Typography>
      </div>

      <div className="flex items-center gap-x-4">
        {/* Tài khoản */}
        <IconButton
          style={{ padding: 0 }}
          onClick={accountPopover.handleOpen}
          ref={accountPopover.anchorRef}
        >
          <AvatarStyled src={''} />
        </IconButton>

        <AccountPopover
          anchorEl={accountPopover.anchorRef.current}
          open={accountPopover.open}
          onClose={accountPopover.handleClose}
        />
        <CompanyLeftDrawer
          drawerOpen={drawerOpen}
          toggleDrawer={toggleDrawer}
        />
      </div>
    </div>
  );
}
