import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Typography, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const { title, children } = props;

  return (
    <StyledMain component="main">
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        variant="text"
        sx={{
          my: 2,
        }}
      >
        Quay lại trang chủ
      </Button>
      <Typography variant="h5" component="h1">
        {title}
      </Typography>

      <Box sx={{ my: 3 }} />

      {children}
    </StyledMain>
  );
};

export default BaseBasicPage;
