import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { useMemo } from 'react';

import useTranslation from '@/hooks/use-translation';

import LocalizationProvider from './localization-provider';
import { createTheme } from './themes';

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation();

  const theme = useMemo(() => createTheme(i18n.language), [i18n.language]);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider>
        <CssBaseline />
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
}
