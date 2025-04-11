import { LocalizationProvider as MuiLocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import useTranslation from '@/hooks/use-translation';
import { dayjs } from '@/services/utils-date';

type TLocalizationProviderProps = {
  children?: React.ReactNode;
};
function LocalizationProvider({ children }: TLocalizationProviderProps) {
  const { i18n } = useTranslation();
  return (
    <MuiLocalizationProvider
      dateLibInstance={dayjs}
      dateAdapter={AdapterDayjs}
      adapterLocale={i18n.language || 'vi'}
    >
      {children}
    </MuiLocalizationProvider>
  );
}

export default LocalizationProvider;
