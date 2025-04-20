import { createTheme as createMuiTheme } from '@mui/material';
import {
  enUS as coreEnUS,
  koKR as coreKoKR,
  viVN as coreViVN,
} from '@mui/material/locale';
import {
  enUS as dataGridEnUS,
  koKR as dataGridKoKR,
  viVN as dataGridViVN,
} from '@mui/x-data-grid';
import {
  enUS as dpEnUS,
  koKR as dpKoKR,
  viVN as dpViVN,
} from '@mui/x-date-pickers';

import { createComponents } from './create-components';
import { createPalette } from './create-palette';
import { createTypography } from './create-typography';

const getMUILocales = (lng: string) => {
  switch (lng) {
    case 'en':
      return [coreEnUS, dataGridEnUS, dpEnUS];
    case 'ko':
      return [coreKoKR, dataGridKoKR, dpKoKR];
    default:
      return [coreViVN, dataGridViVN, dpViVN];
  }
};

export function createTheme(lang: string = 'vi') {
  const palette = createPalette();
  const components = createComponents({ palette });
  const typography = createTypography();

  return createMuiTheme(
    {
      components,
      palette,
      // shadows,
      shape: {
        borderRadius: 8,
      },
      typography,
    },
    ...getMUILocales(lang),
  );
}
