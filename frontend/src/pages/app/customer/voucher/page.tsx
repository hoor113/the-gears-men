// ./voucher/page.tsx
import { Box, Container, Paper, Tab, Tabs, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import Item from './_components/item';
import voucherService from './_services/voucher.service';

const VoucherPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const { data: allVouchers = [] } = useQuery({
    queryKey: ['discount-codes/GetAll'],
    queryFn: () => voucherService.getAll({ maxResultCount: 10000 }),
    enabled: activeTab === 0,
  }) as any;

  const { data: myVouchers } = useQuery({
    queryKey: ['discount-codes/customer'],
    queryFn: () => voucherService.getDiscountCodesOfCustomer(),
    enabled: activeTab === 1 || activeTab === 0,
  } as any);

  const myVoucherIds = Array.isArray(myVouchers)
    ? myVouchers.map((v: any) => v.code)
    : []; // hoặc id nếu có id

  const renderVoucherList = (isTabMyVoucher = false) => {
    const data = isTabMyVoucher ? myVouchers : allVouchers;

    if (!data?.length) {
      return (
        <Typography color="text.secondary" mt={2}>
          Không có voucher nào.
        </Typography>
      );
    }

    return data?.map((item: any) => {
      const isMyVoucher = myVoucherIds?.includes(item.code); // xác định thuộc user chưa
      const isUsed =
        isTabMyVoucher &&
        (Array.isArray(myVouchers)
          ? myVouchers.find((v: any) => v.code === item.code)?.isUsed
          : undefined);

      return (
        <Item
          key={item._id}
          voucherCode={item.code}
          quantity={item.discountQuantity}
          type={item.discountCalculationMethod}
          expiryDate={item.expiryDate}
          isMyVoucher={isTabMyVoucher ? true : isMyVoucher}
          isUsed={!!isUsed}
          isAllTab={!isTabMyVoucher}
        />
      );
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box borderBottom={1} borderColor="divider" mb={3}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Tất cả Voucher" />
          <Tab label="Voucher của tôi" />
        </Tabs>
      </Box>

      <Paper elevation={3} sx={{ p: 3 }}>
        {activeTab === 0 && (
          <>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Tất cả Voucher
            </Typography>
            {renderVoucherList(false)}
          </>
        )}
        {activeTab === 1 && (
          <>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Voucher của tôi
            </Typography>
            {renderVoucherList(true)}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default VoucherPage;
