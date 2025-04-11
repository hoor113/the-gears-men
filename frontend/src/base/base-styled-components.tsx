import {
  Box,
  SxProps,
  Tooltip,
  TooltipProps,
  css,
  styled,
  tooltipClasses,
} from '@mui/material';
import { grey } from '@mui/material/colors';

import Scrollbar from '@/components/scrollbar';

export const StyledCardWrapper = styled(Scrollbar)`
  flex: 1 1 auto;
`;

export const StyledPaginationWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: flex-end;
  position: sticky;
  bottom: 0px;
  width: 100%;
  padding: 16px 0;
`;

export const StyledPaginationCard = styled(Box)`
  padding: 6px 8px 8px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.palette.common.white};
  box-shadow: ${({ theme }) => theme.shadows[1]};
`;

export const sxScrollbarStyled = {
  '&::-webkit-scrollbar': {
    height: '8px',
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: grey[50],
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: grey[400],
    borderRadius: '8px',
  },
};

export const cssScrollbarStyled = css`
  &::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background-color: ${grey[50]};
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${grey[400]};
    border-radius: 8px;
  }
`;

export const sxHideScrollbar = {
  scrollbarWidth: 0,
  '&::-webkit-scrollbar': {
    display: 'none',
  },
};

export const sxTextEllipsis = (lineCamp = 2): SxProps => ({
  textOverflow: 'ellipsis',
  flexShrink: 'inherit',
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: lineCamp,
});

export const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));
