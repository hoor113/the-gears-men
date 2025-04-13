import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  Divider,
  MenuItem,
  MenuList,
  Popover,
  Typography,
  alpha,
  styled,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import useTranslation from '@/hooks/use-translation';
import { AuthContext } from '@/services/auth/auth.context';
import authService from '@/services/auth/auth.service';

type TAccountPopover = {
  anchorEl: any;
  onClose: () => void;
  open: boolean;
};

const AccountPopover = (props: TAccountPopover) => {
  const [authState, authDispatch] = useContext(AuthContext);

  const { t } = useTranslation();

  const { anchorEl, onClose, open } = props;

  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      onClose?.();
      authDispatch({ type: 'logout' });
      navigate('/auth/login');
    },
    onError: () => {
      onClose?.();
      authDispatch({ type: 'logout' });
      navigate('/auth/login');
    },
  });

  const handleLogout = useCallback(() => {
    onClose?.();
    logoutMutation.mutate();
  }, [logoutMutation, onClose]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'right',
        vertical: 50,
      }}
      onClose={onClose}
      open={open}
    >
      <MenuListStyled disablePadding dense>
        <MenuItemStyled
          sx={{
            backgroundColor: (theme) => alpha(theme.palette.grey[100], 0.5),
          }}
          className="item-account"
          onClick={() => navigate('/settings/my-account')}
        >
          <Typography variant="overline">{t('Tài khoản')}</Typography>
          <Typography color="text.secondary" variant="body2">
            {authState.currentUser?.userName}
          </Typography>
          <AccountCircleIcon />
        </MenuItemStyled>
        <Divider />
        <MenuItemStyled onClick={() => handleLogout()} className="item-logout">
          <span>{t('Đăng xuất')}</span>
          <LogoutIcon fontSize="small" />
        </MenuItemStyled>
      </MenuListStyled>
    </Popover>
  );
};

const MenuListStyled = styled(MenuList)`
  padding: 8px;
  width: 200px;
`;

const MenuItemStyled = styled(MenuItem)`
  padding: 4px 8px;
  border-radius: 4px;

  position: relative;
  width: 100%;
  &.item-logout > svg {
    position: absolute;
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
  }

  &.item-account {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    overflow: hidden;
    & > svg {
      position: absolute;
      right: 6px;
      top: 6px;
    }
  }
`;

export default AccountPopover;
