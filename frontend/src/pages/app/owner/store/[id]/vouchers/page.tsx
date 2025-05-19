import NiceModal from '@ebay/nice-modal-react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

import BasePagination from '@/base/base-pagination';
import appService from '@/services/app/app.service';

import AddDiscountCodeModal from './_components/add-voucher-modal';
import OwnerVoucherItem from './_components/voucher-item';
import {
  EDiscountCalculationMethod,
  EDiscountCodeType,
} from './_services/voucher.model';
import ownerVoucherService from './_services/voucher.service';

// Nhãn enum tiếng Việt
const VoucherTypeLabels = {
  [EDiscountCodeType.ProductDiscount]: 'Giảm giá sản phẩm',
  [EDiscountCodeType.ShippingDiscount]: 'Giảm giá vận chuyển',
};

const VoucherMethodLabels = {
  [EDiscountCalculationMethod.Percentage]: 'Theo phần trăm',
  [EDiscountCalculationMethod.FixedAmount]: 'Theo số tiền',
};

const pageSizeOptions = [5, 10, 20, 50];

const OwnerVoucherPage = () => {
  const [filterType, setFilterType] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: vouchers = [],
    isLoading,
    isFetching,
  } = useQuery<any>({
    queryKey: ['vouchers/getAll', { filterType, filterMethod }],
    queryFn: () =>
      ownerVoucherService.getAll({
        type: filterType || undefined,
        discountCalculationMethod: filterMethod || undefined,
        skipCount: 0,
        maxResultCount: 1000,
      }),
    keepPreviousData: true,
  });

  useEffect(() => {
    if (isLoading || isFetching) {
      appService.showLoadingModal();
    } else {
      appService.hideLoadingModal();
    }
  }, [isLoading, isFetching]);

  // Tính dữ liệu cho trang hiện tại
  const paginatedVouchers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return vouchers.slice(startIndex, startIndex + pageSize);
  }, [vouchers, currentPage, pageSize]);

  // Khi filter thay đổi reset về trang 1
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, filterMethod]);

  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterType(e.target.value);
  };

  const handleFilterMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterMethod(e.target.value);
  };

  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>
        Danh sách mã giảm giá
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mb={2}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            NiceModal.show(AddDiscountCodeModal, {
              filter: { filterType, filterMethod },
            })
          }
        >
          Thêm mã giảm giá
        </Button>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Số dòng/trang</InputLabel>
          <Select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            label="Số dòng/trang"
          >
            {pageSizeOptions.map((size) => (
              <MenuItem key={size} value={size}>
                {size}/trang
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Bộ lọc
            </Typography>

            <Box>
              <Typography variant="subtitle1" mb={1}>
                Loại mã giảm giá
              </Typography>
              <RadioGroup value={filterType} onChange={handleFilterTypeChange}>
                <FormControlLabel value="" control={<Radio />} label="Tất cả" />
                {Object.entries(VoucherTypeLabels).map(([key, label]) => (
                  <FormControlLabel
                    key={key}
                    value={key}
                    control={<Radio />}
                    label={label}
                  />
                ))}
              </RadioGroup>
            </Box>

            <Box mt={2}>
              <Typography variant="subtitle1" mb={1}>
                Phương thức giảm
              </Typography>
              <RadioGroup
                value={filterMethod}
                onChange={handleFilterMethodChange}
              >
                <FormControlLabel value="" control={<Radio />} label="Tất cả" />
                {Object.entries(VoucherMethodLabels).map(([key, label]) => (
                  <FormControlLabel
                    key={key}
                    value={key}
                    control={<Radio />}
                    label={label}
                  />
                ))}
              </RadioGroup>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Grid container spacing={2}>
              {paginatedVouchers.length > 0 ? (
                paginatedVouchers.map((voucher: any) => (
                  <Grid item xs={12} sm={6} md={3} key={voucher.id}>
                    <OwnerVoucherItem voucher={voucher} />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography>Không có dữ liệu</Typography>
                </Grid>
              )}
            </Grid>

            <Box mt={2} display="flex" justifyContent="center">
              <BasePagination
                currentPage={currentPage}
                totalPages={Math.ceil(vouchers.length / pageSize)}
                onPageChange={setCurrentPage}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OwnerVoucherPage;
