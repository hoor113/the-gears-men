import GTranslateIcon from '@mui/icons-material/GTranslate';
import { ButtonProps, Menu, MenuItem, MenuProps } from '@mui/material';
import { useState } from 'react';

import useTranslation from '@/hooks/use-translation';

import IconButton from '../button/icon-button';

type TSelectChangeLocaleProps = {
  buttonProps?: Omit<ButtonProps, 'size'> & {
    size?: number;
    icon?: React.ReactNode;
  };
  menuProps?: Omit<MenuProps, 'open'>;
};
const items = [
  {
    title: '🇻🇳 Tiếng Việt',
    value: 'vi',
  },
  {
    title: '🇬🇧 English',
    value: 'en',
  },
];

const SelectChangeLocale = ({
  buttonProps = {},
  menuProps,
}: TSelectChangeLocaleProps) => {
  const { size, icon, ...restButtonProps } = buttonProps;
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = !!anchorEl;

  return (
    <>
      <IconButton
        {...restButtonProps}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        size={size || 48}
      >
        {icon ||
          (i18n.language === 'vi' ? (
            '🇻🇳'
          ) : i18n.language === 'en' ? (
            '🇬🇧'
          ) : (
            <GTranslateIcon fontSize="medium" />
          ))}
      </IconButton>
      <Menu
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={() => setAnchorEl(null)}
        {...menuProps}
      >
        {items.map((item) => (
          <MenuItem
            selected={i18n.language === item.value}
            key={item.value}
            onClick={() => {
              i18n.changeLanguage(item.value);
              setAnchorEl(null);
              // replace({ pathname, query }, asPath, { locale: key });
            }}
          >
            {item.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default SelectChangeLocale;
