import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function FailPage() {
  const navigate = useNavigate();

  return (
    <Stack justifyContent="center" alignItems="center" minHeight="80vh" px={2}>
      <Paper
        elevation={3}
        sx={{ p: 4, maxWidth: 500, width: '100%', textAlign: 'center' }}
      >
        <ErrorOutlineIcon color="error" sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Thanh toán thất bại
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Đã xảy ra lỗi khi xử lý đơn hàng của bạn. Vui lòng thử lại sau.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
        >
          Quay lại mua hàng
        </Button>
      </Paper>
    </Stack>
  );
}
