import { MenuItem, MenuList, Popover } from '@mui/material';

import useTranslation from '@/hooks/use-translation';

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

type TLanguagePopover = {
  anchorEl: any;
  onClose: () => void;
  open: boolean;
};

const LanguagePopover = (props: TLanguagePopover) => {
  const { anchorEl, onClose, open } = props;

  const { i18n } = useTranslation();

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom',
      }}
      onClose={onClose}
      open={open}
    >
      <MenuList
        disablePadding
        dense
        sx={{
          p: '8px',
          '& > *': {
            borderRadius: 1,
          },
        }}
      >
        {items.map((item) => (
          <MenuItem
            selected={i18n.language === item.value}
            key={item.value}
            onClick={() => {
              i18n.changeLanguage(item.value);
            }}
          >
            {item.title}
          </MenuItem>
        ))}
      </MenuList>
    </Popover>
  );
};

export default LanguagePopover;
