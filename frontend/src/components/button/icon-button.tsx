import { Button, ButtonProps } from '@mui/material';
import { ForwardRefRenderFunction, forwardRef } from 'react';

type TIconButtonProps = Omit<ButtonProps, 'size'> & {
  size?: number;
};

const IconButton: ForwardRefRenderFunction<
  HTMLButtonElement,
  TIconButtonProps
> = ({ size, style, children, ...props }, forwardedRef) => {
  return (
    <Button
      ref={forwardedRef}
      style={{
        width: size || 48,
        minWidth: size || 48,
        height: size || 48,
        padding: 0,
        ...style,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default forwardRef(IconButton);
