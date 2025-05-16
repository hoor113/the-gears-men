import { alpha } from '@mui/material/styles';

const withAlphas = (color: any) => {
  return {
    ...color,
    alpha4: alpha(color.main, 0.04),
    alpha8: alpha(color.main, 0.08),
    alpha12: alpha(color.main, 0.12),
    alpha30: alpha(color.main, 0.3),
    alpha50: alpha(color.main, 0.5),
  };
};

export const grey = {
  50: '#F8F9FA',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D2D6DB',
  400: '#9DA4AE',
  500: '#6C737F',
  600: '#4D5761',
  700: '#2F3746',
  800: '#1C2536',
  900: '#111927',
};

export const indigo = withAlphas({
  lightest: '#F5F7FF',
  light: '#EBEEFE',
  main: '#6366F1',
  dark: '#4338CA',
  darkest: '#312E81',
  contrastText: '#FFFFFF',
});

export const success = withAlphas({
  lightest: '#F0FDF9',
  light: '#3FC79A',
  main: '#10B981',
  dark: '#0B815A',
  darkest: '#134E48',
  contrastText: '#FFFFFF',
});

export const info = withAlphas({
  light: '#03a9f4',
  main: '#0288d1',
  dark: '#01579b',
  contrastText: '#FFFFFF',
});

export const warning = withAlphas({
  lightest: '#FFFBE6',
  light: '#FFF0B3',
  main: '#FFC107', // vàng sáng kiểu cảnh báo
  dark: '#FF9800',
  darkest: '#F57C00',
  contrastText: '#000000', // đổi contrast nếu màu nền quá sáng
});

export const error = withAlphas({
  lightest: '#FEF3F2',
  light: '#FEE4E2',
  main: '#F04438',
  dark: '#B42318',
  darkest: '#7A271A',
  contrastText: '#FFFFFF',
});

export const primary = withAlphas({
  lightest: '#FFFAEB', // giống warning.lightest
  light: '#FEF0C7', // giống warning.light
  main: '#F79009', // giống warning.main
  dark: '#B54708', // giống warning.dark
  darkest: '#7A2E0E', // giống warning.darkest
  contrastText: '#FFFFFF',
});
