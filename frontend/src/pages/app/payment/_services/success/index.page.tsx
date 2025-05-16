import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function SuccessPage() {
  const navigate = useNavigate();
  return (
    <Stack justifyContent="center" alignItems="center" minHeight="80vh" px={2}>
      <Paper
        elevation={3}
        sx={{ p: 4, maxWidth: 500, width: '100%', textAlign: 'center' }}
      >
        <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Đã thanh toán thành công!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Đơn hàng của bạn đang chờ duyệt.
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
