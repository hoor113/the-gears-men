import {
  Components,
  Palette,
  alpha,
  createTheme,
  filledInputClasses,
  inputLabelClasses,
  outlinedInputClasses,
  paperClasses,
  tableCellClasses,
} from '@mui/material';

import { sxScrollbarStyled } from '@/base/base-styled-components';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    dashed: true;
    soft: true;
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsVariantOverrides {
    soft: true;
  }
}

// Used only to create transitions
const muiTheme = createTheme();

type TConfig = {
  palette: Palette;
};

export const createComponents = (
  config: TConfig,
): Components & { MuiDataGrid: any; MuiTreeView: any } => {
  const { palette } = config;

  return {
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => {
          const currentColor =
            ownerState.color !== 'inherit' &&
            palette[ownerState.color || 'primary'].main;
          const bgColor = currentColor || palette.grey[500];
          return {
            borderRadius: '12px',
            textTransform: 'none',
            ...(ownerState.variant === 'soft' && {
              color: currentColor || 'inherit',
              fontWeight: 600,
              backgroundColor: alpha(bgColor, 0.1),
              '&:hover': {
                backgroundColor: alpha(bgColor, 0.15),
              },
            }),
            ...(ownerState.variant === 'dashed' && {
              color: currentColor || 'inherit',
              border: `1px dashed ${alpha(bgColor, 0.1)}`,
            }),
          };
        },
        sizeSmall: {
          padding: '6px 16px',
        },
        sizeMedium: {
          padding: '8px 20px',
        },
        sizeLarge: {
          padding: '11px 24px',
        },
        textSizeSmall: {
          padding: '7px 12px',
        },
        textSizeMedium: {
          padding: '9px 16px',
        },
        textSizeLarge: {
          padding: '12px 16px',
        },
        contained: {
          boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.1)',
        },
      },
      variants: [
        {
          props: { variant: 'dashed' },
          style: {},
        },
        {
          props: { variant: 'soft' },
          style: {},
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          [`&.${paperClasses.elevation1}`]: {
            boxShadow:
              '0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '32px 24px',
          '&:last-child': {
            paddingBottom: '32px',
          },
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: {
          variant: 'h6',
        },
        subheaderTypographyProps: {
          variant: 'body2',
        },
      },
      styleOverrides: {
        root: {
          padding: '32px 24px 16px',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          MozOsxFontSmoothing: 'grayscale',
          WebkitFontSmoothing: 'antialiased',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
          width: '100%',
        },
        body: {
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          minHeight: '100%',
          width: '100%',
        },
        '#__next': {
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
        },
        '#nprogress': {
          pointerEvents: 'none',
        },
        '#nprogress .bar': {
          backgroundColor: palette.primary.main,
          height: 3,
          left: 0,
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 2000,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&::placeholder': {
            // opacity: 1,
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        input: {
          '&::placeholder': {
            color: palette.text.secondary,
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          borderRadius: 8,
          borderStyle: 'solid',
          borderWidth: 1,
          overflow: 'hidden',
          borderColor: palette.grey[200],
          transition: muiTheme.transitions.create([
            'border-color',
            'box-shadow',
          ]),
          '&:hover': {
            backgroundColor: palette.action.hover,
          },
          '&:before': {
            display: 'none',
          },
          '&:after': {
            display: 'none',
          },
          [`&.${filledInputClasses.disabled}`]: {
            backgroundColor: 'transparent',
          },
          [`&.${filledInputClasses.focused}`]: {
            backgroundColor: 'transparent',
            borderColor: palette.primary.main,
            boxShadow: `${palette.primary.main} 0 0 0 2px`,
          },
          [`&.${filledInputClasses.error}`]: {
            borderColor: palette.error.main,
            boxShadow: `${palette.error.main} 0 0 0 2px`,
          },
        },
        input: {
          fontWeight: 500,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: palette.action.hover,
            [`& .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: palette.grey[200],
            },
          },
          [`&.${outlinedInputClasses.focused}`]: {
            backgroundColor: 'transparent',
            [`& .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: palette.primary.main,
            },
          },
          [`&.${filledInputClasses.error}`]: {
            [`& .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: palette.error.main,
            },
          },
        },
        input: {
          fontWeight: 500,
        },
        notchedOutline: {
          borderColor: palette.grey[200],
          transition: muiTheme.transitions.create([
            'border-color',
            'box-shadow',
          ]),
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: 14,
          fontWeight: 500,
          [`&.${inputLabelClasses.filled}`]: {
            transform: 'translate(12px, 18px) scale(1)',
          },
          [`&.${inputLabelClasses.shrink}`]: {
            [`&.${inputLabelClasses.standard}`]: {
              transform: 'translate(0, -1.5px) scale(0.85)',
            },
            [`&.${inputLabelClasses.filled}`]: {
              transform: 'translate(12px, 6px) scale(0.85)',
            },
            [`&.${inputLabelClasses.outlined}`]: {
              transform: 'translate(14px, -9px) scale(0.85)',
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: 14,
          fontWeight: 500,
          lineHeight: 1.71,
          minWidth: 'auto',
          textTransform: 'none',
        },
      },
    },
    // MuiTableCell: {
    //   styleOverrides: {
    //     root: {
    //       borderBottomColor: palette.divider,
    //       padding: '15px 16px',
    //     },
    //   },
    // },
    MuiTableHead: {
      styleOverrides: {
        root: {
          borderBottom: 'none',
          [`& .${tableCellClasses.root}`]: {
            // borderBottom: 'none',
            backgroundColor: palette.grey[100],
            // color: palette.grey[900],
            fontWeight: 600,
            lineHeight: 1,
            // letterSpacing: 0.5,
            // textTransform: 'uppercase',
          },
          [`& .${tableCellClasses.paddingCheckbox}`]: {
            paddingTop: 4,
            paddingBottom: 4,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {},
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          '& .MuiDialog-container': {
            alignItems: 'flex-start',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ ownerState }) => {
          if (ownerState.variant === 'soft') {
            const currentColor =
              ownerState.color === 'default'
                ? palette.grey[500]
                : palette[ownerState.color || 'primary'].main;
            return {
              color: currentColor,
              fontWeight: 500,
              backgroundColor: alpha(currentColor, 0.1),
            };
          }
        },
      },
      variants: [
        {
          props: { variant: 'soft', color: 'error' },
          style: {
            color: palette.error.main,
            '& .MuiChip-avatarMedium': {
              color: 'inherit',
              backgroundColor: alpha(palette.error.main, 0.2),
            },
            '& .MuiChip-deleteIcon': {
              color: alpha(palette.error.main, 0.8),
            },
          },
        },
      ],
    },
    MuiBadge: {
      styleOverrides: {
        badge: ({ ownerState }) => {
          return {
            ...(ownerState.color === 'default' && {
              backgroundColor: palette.grey[300],
            }),
          };
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: { ...sxScrollbarStyled },
      },
    },
    MuiPopover: {
      styleOverrides: {
        root: { ...sxScrollbarStyled },
        paper: { ...sxScrollbarStyled },
      },
    },
    MuiTreeView: {
      styleOverrides: {
        root: { ...sxScrollbarStyled },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        listbox: {
          ...sxScrollbarStyled,
        },
      },
    },
  };
};
