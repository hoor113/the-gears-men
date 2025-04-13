import { Box, Typography, styled } from '@mui/material';

type TBaseBasicPageProps = {
  title: string;
  name: string;
  children?: React.ReactNode;
};

const StyledMain = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
}));

const BaseBasicPage = (props: TBaseBasicPageProps) => {
  const { title, children } = props;

  return (
    <StyledMain component="main">
      <Typography variant="h5" component="h1">
        {title}
      </Typography>

      <Box sx={{ my: 3 }} />

      {children}
    </StyledMain>
  );
};

export default BaseBasicPage;
