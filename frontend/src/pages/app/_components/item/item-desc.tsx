import {
  Stack,
  SvgIconProps,
  SxProps,
  Typography,
  styled,
} from '@mui/material';
import React from 'react';

type TItemDescProps = {
  Icon?: React.ElementType<SvgIconProps>;
  iconProps?: SvgIconProps;
  label?: React.ReactNode;
  preLabel?: React.ReactNode;
  suffixLabel?: React.ReactNode;
  fallback?: React.ReactNode;
  sx?: SxProps;
};

const ItemDesc = ({
  Icon,
  iconProps,
  label,
  preLabel,
  fallback = '0',
  sx,
}: TItemDescProps) => {
  return (
    <ItemDescStyled direction="row" alignItems="center" spacing={1} sx={sx}>
      {Icon && <Icon fontSize="small" color="primary" {...iconProps} />}
      {preLabel ? (
        <div
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          <Typography noWrap component="span" fontSize={15}>
            {preLabel ? `${preLabel}: ` : ''}
          </Typography>
          <span style={{ fontWeight: 500, opacity: label ? 1 : 0.4 }}>
            {label || fallback}
          </span>
        </div>
      ) : (
        <Typography noWrap style={{ opacity: label ? 1 : 0.4 }}>
          {label || fallback}
        </Typography>
      )}
    </ItemDescStyled>
  );
};
const ItemDescStyled = styled(Stack)``;

export default ItemDesc;
