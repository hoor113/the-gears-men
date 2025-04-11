import { Button, ButtonProps, styled } from '@mui/material';
import { ForwardRefRenderFunction, forwardRef } from 'react';

type TLoadingButtonProps = { loading?: boolean } & ButtonProps;

const LoadingButton: ForwardRefRenderFunction<
  HTMLButtonElement,
  TLoadingButtonProps
> = ({ children, loading, ...props }, forwardedRef) => {
  return (
    <LoadingButtonStyled ref={forwardedRef} {...props}>
      {loading ? '...' : children}
    </LoadingButtonStyled>
  );
};

const LoadingButtonStyled = styled(Button)``;

export default forwardRef(LoadingButton);
