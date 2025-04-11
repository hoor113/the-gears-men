import {
  MenuTwoTone as MenuIcon,
  TranslateTwoTone as TranslateIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useContext } from 'react';
import { useScroll } from 'react-use';

import SelectChangeLocale from '@/components/field/select-change-locale';
import { MainScrollbarContext } from '@/components/scrollbar';
import { ADMIN_LAYOUT } from '@/configs/constant.config';
import usePopover from '@/hooks/use-popover';

import AccountPopover from './account-popover';
import LanguagePopover from './language-popover';

type TTopNavProps = {
  onNavOpen: () => void;
  openNavLg: boolean;
};

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

export const TopNav = (props: TTopNavProps) => {
  const { onNavOpen, openNavLg } = props;

  const { scrollableNodeRef } = useContext(MainScrollbarContext);
  const { y: scrollY } = useScroll(scrollableNodeRef);

  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'));

  const accountPopover = usePopover();
  const languagePopover = usePopover();

  const PADDING_LEFT = lgUp && openNavLg ? ADMIN_LAYOUT.SIDE_NAV_WIDTH : 0;
  const BG_COLOR = alpha(theme.palette.common.white, 0.95);
  const TEXT_COLOR = alpha(theme.palette.getContrastText(BG_COLOR), 0.5);

  return (
    <>
      <Box
        component="header"
        sx={{
          backdropFilter: 'blur(6px)',
          backgroundColor: BG_COLOR,
          position: 'sticky',
          left: {
            lg: PADDING_LEFT,
          },
          top: 0,
          width: {
            lg: `calc(100% - ${PADDING_LEFT}px)`,
          },
          zIndex: theme.zIndex.appBar,
          height: 64,
          borderBottom:
            scrollY > 0 ? `1px solid ${theme.palette.grey[200]}` : undefined,
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{
            minHeight: ADMIN_LAYOUT.TOP_NAV_HEIGHT,
            px: 2,
          }}
        >
          <Stack alignItems="center" direction="row" spacing={2}>
            {!lgUp && (
              <IconButton
                onClick={onNavOpen}
                sx={{
                  color: theme.palette.getContrastText(
                    theme.palette.common.white,
                  ),
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Stack>

          <Stack alignItems="center" direction="row" spacing={2}>
            <SelectChangeLocale
              buttonProps={{
                variant: 'text',
                size: 38,
                icon: <TranslateIcon fontSize="medium" />,
                sx: {
                  borderColor: theme.palette.grey[200],
                  color: TEXT_COLOR,
                  p: 0,
                },
              }}
              menuProps={{
                anchorOrigin: {
                  horizontal: 'right',
                  vertical: 44,
                },
              }}
            />

            <IconButton
              style={{ padding: 0 }}
              onClick={accountPopover.handleOpen}
              ref={accountPopover.anchorRef}
            >
              <AvatarStyled src={""} />
            </IconButton>
          </Stack>
        </Stack>
      </Box>
      <AccountPopover
        anchorEl={accountPopover.anchorRef.current}
        open={accountPopover.open}
        onClose={accountPopover.handleClose}
      />
      <LanguagePopover
        anchorEl={languagePopover.anchorRef.current}
        open={languagePopover.open}
        onClose={languagePopover.handleClose}
      />
    </>
  );
};
