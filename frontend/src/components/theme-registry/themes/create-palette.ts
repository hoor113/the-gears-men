import { common } from '@mui/material/colors';
import { Palette, alpha } from '@mui/material/styles';

import { error, grey, info, primary, success, warning } from './colors';

export const createPalette = (): Palette => {
  return {
    action: {
      active: grey[500],
      disabled: alpha(grey[900], 0.38),
      disabledBackground: alpha(grey[900], 0.12),
      focus: alpha(grey[900], 0.16),
      hover: alpha(grey[900], 0.04),
      selected: alpha(grey[900], 0.12),
    },
    background: {
      default: common.white,
      paper: common.white,
    },
    divider: '#F2F4F7',
    error,
    info,
    mode: 'light',
    grey: grey,
    primary: primary,
    secondary: primary,
    success,
    text: {
      primary: grey[900],
      secondary: grey[500],
      disabled: alpha(grey[900], 0.38),
    },
    warning,
  } as Palette;
};
