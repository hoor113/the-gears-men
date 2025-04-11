import { styled } from '@mui/material';

type TLogoProps = {
  size?: number;
} & React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

const Logo = ({ size = 64, ...rest }: TLogoProps) => {
  return (
    <StyledImg
      src="/assets/images/logo.png"
      alt="Logo"
      width={size}
      height={size}
      {...rest}
    />
  );
};

const StyledImg = styled('img')(() => ({}));

export default Logo;
