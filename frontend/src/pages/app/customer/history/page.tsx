import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Pagination,
  Divider,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useTranslation from '@/hooks/use-translation';
import orderHistoryService, { 
  IPendingOrderResponse, 
  IOrderHistory, 
  IPendingOrder 
} from './_services/history.services';
import OrderItem from './_components/order-item';
import UnconfirmedOrderItem from './_components/unconfirmed-order-item';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`order-history-tabpanel-${index}`}
      aria-labelledby={`order-history-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `order-history-tab-${index}`,
    'aria-controls': `order-history-tabpanel-${index}`,
  };
}

export default function OrderHistoryPage() {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [pendingPage, setPendingPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  
  const queryClient = useQueryClient();

  // Query for pending orders
  const {
    data: pendingData,
    isLoading: pendingIsLoading
  } = useQuery<IPendingOrderResponse>({
    queryKey: ['orders/pending', pendingPage],
    queryFn: async () => {
      try {
        return orderHistoryService.getPendingOrders(pendingPage, rowsPerPage);
      } catch (error) {
        console.error("Error fetching pending orders:", error);
        return {
          items: [] as IPendingOrder[],
          totalPages: 0,
          totalCount: 0,
          totalRecords: 0,
          data: []
        };
      }
    },
    enabled: tabValue === 0, // Only run when this tab is active
  });

  // Query for confirmed/history orders
  const {
    data: historyData,
    isLoading: historyIsLoading
  } = useQuery<IOrderHistory>({
    queryKey: ['orders/history', historyPage],
    queryFn: async () => {
      try {
        return orderHistoryService.getConfirmedOrders(historyPage, rowsPerPage);
      } catch (error) {
        console.error("Error fetching order history:", error);
        return {
          items: [],
          totalPages: 0,
          totalCount: 0,
          totalRecords: 0,
          data: []
        };
      }
    },
    enabled: tabValue === 1, // Only run when this tab is active
  });

  // Mutation for cancelling orders
  const cancelOrderMutation = useMutation({
    mutationFn: (orderId: string) => {
      return orderHistoryService.cancelOrder(orderId);
    },
    onSuccess: () => {
      // Invalidate pending orders query to refresh data
      queryClient.invalidateQueries({ queryKey: ['orders/pending'] });
      // Invalidate history orders query as the cancelled order will move there
      queryClient.invalidateQueries({ queryKey: ['orders/history'] });
      
      setSnackbar({
        open: true,
        message: t('Đơn hàng đã được hủy thành công'),
        severity: 'success'
      });
    },
    onError: (error) => {
      console.error('Error cancelling order:', error);
      setSnackbar({
        open: true,
        message: t('Không thể hủy đơn hàng. Vui lòng thử lại sau.'),
        severity: 'error'
      });
    }
  });

  // Handle tab changes
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Separate handlers for each pagination
  const handlePendingPageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPendingPage(newPage);
  };

  const handleHistoryPageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setHistoryPage(newPage);
  };

  // Cancel order handlers
  const handleCancelOrderClick = (orderId: string) => {
    setCancelOrderId(orderId);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    if (cancelOrderId) {
      cancelOrderMutation.mutate(cancelOrderId);
    }
    setCancelDialogOpen(false);
    setCancelOrderId(null);
  };

  const handleCancelDialogClose = () => {
    setCancelDialogOpen(false);
    setCancelOrderId(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('Đơn hàng')}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Paper elevation={3}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="order history tabs"
            variant="fullWidth"
          >
            <Tab label={t('Đang xác nhận')} {...a11yProps(0)} />
            <Tab label={t('Lịch sử đặt hàng')} {...a11yProps(1)} />
          </Tabs>
        </Box>
        
        {/* Pending orders tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            {pendingIsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : pendingData?.items && pendingData.items.length > 0 ? (
              <>
                <Box>
                  {pendingData.items.map((order) => (
                    <UnconfirmedOrderItem
                      key={order._id}
                      order={{
                        id: order._id,
                        date: order.createdAt,
                        status: order.orderStatus,
                        total: order.totalPrice,
                        items: order.items.map((item) => ({
                          id: item._id,
                          product: {
                            id: item.productId._id,
                            name: item.productId.name,
                            price: item.price,
                            imageUrl: item.productId.imageUrl
                          },
                          quantity: item.quantity,
                          price: item.price,
                          shippingPrice: item.shippingPrice,
                          productDiscountCode: item.productDiscountCode?.code,
                          shippingDiscountCode: item.shippingDiscountCode?.code
                        }))
                      }}
                      onCancel={handleCancelOrderClick}
                    />
                  ))}
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination 
                    count={pendingData.totalPages || 1} 
                    page={pendingPage} 
                    onChange={handlePendingPageChange} 
                    color="primary" 
                  />
                </Box>
              </>
            ) : (
              <Box sx={{ py: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  {t('Bạn không có đơn hàng đang xác nhận')}
                </Typography>
              </Box>
            )}
          </Box>
        </TabPanel>
        
        {/* History orders tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            {historyIsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : historyData?.items && historyData.items.length > 0 ? (
              <>
                <Box>
                  {historyData.items.map((order) => (
                    <OrderItem 
                      key={order.id}
                      order={order}
                    />
                  ))}
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination 
                    count={historyData.totalPages || 1} 
                    page={historyPage} 
                    onChange={handleHistoryPageChange} 
                    color="primary" 
                  />
                </Box>
              </>
            ) : (
              <Box sx={{ py: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  {t('Bạn chưa có lịch sử đơn hàng')}
                </Typography>
              </Box>
            )}
          </Box>
        </TabPanel>
      </Paper>

      {/* Confirmation Dialog for Cancelling Orders */}
      <Dialog
        open={cancelDialogOpen}
        onClose={handleCancelDialogClose}
        aria-labelledby="cancel-order-dialog-title"
        aria-describedby="cancel-order-dialog-description"
      >
        <DialogTitle id="cancel-order-dialog-title">
          {t('Xác nhận hủy đơn hàng')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-order-dialog-description">
            {t('Bạn có chắc chắn muốn hủy đơn hàng này không? Thao tác này không thể hoàn tác.')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDialogClose} color="inherit">
            {t('Không')}
          </Button>
          <Button onClick={handleConfirmCancel} color="error" autoFocus>
            {t('Hủy đơn hàng')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}