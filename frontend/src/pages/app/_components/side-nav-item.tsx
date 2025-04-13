import {
  KeyboardArrowDownTwoTone as CloseIcon,
  KeyboardArrowRightTwoTone as OpenIcon,
} from '@mui/icons-material';
import { Box, ButtonBase, Collapse, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEffectOnce } from 'react-use';

import { sxTextEllipsis } from '@/base/base-styled-components';

type TSideNavItemProps = {
  level?: number;
  active?: boolean;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ReactNode;
  path?: string;
  title: string;
  itemChildren?: TSideNavItemProps[];
};

const SideNavItem = (props: TSideNavItemProps) => {
  const {
    level = 1,
    active = false,
    disabled,
    external,
    icon,
    path,
    title,
    itemChildren,
  } = props;

  const { pathname } = useLocation();

  const [open, setOpen] = useState(false);

  const linkProps = path
    ? external
      ? {
          component: 'a',
          href: path,
          target: '_blank',
        }
      : {
          component: Link,
          to: path,
        }
    : {};

  useEffectOnce(() => {
    setOpen(active);
  });

  return (
    <li>
      <ButtonBase
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'flex-start',
          pl: '16px',
          pr: '16px',
          py: '6px',
          textAlign: 'left',
          width: '100%',
          overflow: 'hidden',
          ...(active &&
            level === 1 && {
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
            }),
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
          },
        }}
        {...linkProps}
        onClick={() => setOpen(!open)}
      >
        {(icon || level > 1) && (
          <Box
            component="span"
            sx={{
              alignItems: 'center',
              color: 'grey.400',
              display: 'inline-flex',
              justifyContent: 'center',
              mr: 2,
              ...(active && {
                color: 'primary.main',
              }),
            }}
          >
            {icon || (
              <Box
                sx={{ width: 24, height: 24 }}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {active && (
                  <Box
                    sx={{
                      height: 6,
                      width: 6,
                      borderRadius: '50%',
                      bgcolor: (theme) => theme.palette.primary.main,
                    }}
                  />
                )}
              </Box>
            )}
          </Box>
        )}
        <Typography
          sx={{
            color: 'grey.400',
            flexGrow: 1,
            fontFamily: (theme) => theme.typography.fontFamily,
            fontSize: level === 1 ? '14px' : '13px',
            fontWeight: level === 1 ? 600 : 500,
            lineHeight: 1.25,
            ...(active && {
              color: 'common.white',
            }),
            ...(disabled && {
              color: 'grey.500',
            }),
            ...sxTextEllipsis(2),
          }}
        >
          {title}
        </Typography>
        {itemChildren && itemChildren?.length > 0 && (
          <Box
            component="span"
            sx={{
              color: 'grey.500',
            }}
          >
            {open ? <CloseIcon /> : <OpenIcon />}
          </Box>
        )}
      </ButtonBase>

      {itemChildren && itemChildren?.length > 0 && (
        <Collapse in={open}>
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: 'none',
              p: 0,
              '&:first-of-type': {
                mt: 1,
              },
            }}
          >
            {itemChildren?.map((item, index) => {
              const active = item.path ? pathname === item.path : false;

              return (
                <SideNavItem
                  level={level + 1}
                  active={active}
                  disabled={item.disabled}
                  external={item.external}
                  key={index}
                  path={item.path}
                  title={item.title}
                  itemChildren={item?.itemChildren}
                />
              );
            })}
          </Stack>
        </Collapse>
      )}
    </li>
  );
};

export default SideNavItem;
