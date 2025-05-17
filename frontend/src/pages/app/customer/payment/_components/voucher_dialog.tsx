import NiceModal, { muiDialogV5, useModal } from '@ebay/nice-modal-react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';

export type VoucherDialogProps = {
  productId: string;
  productName: string;
  discounts: any[];
  discountsDict: any;
  setDictionary: (
    productId: string,
    productDiscount: string | null,
    shippingDiscount: string | null,
  ) => void;
};

const VoucherDialog = NiceModal.create((props: VoucherDialogProps) => {
  const modal = useModal();
  const { productId, productName, discounts, discountsDict, setDictionary } =
    props;

  const [currentProductDiscount, setCurrentProductDiscount] = useState<any>(
    discountsDict[productId]?.productDiscount ?? null,
  );
  const [currentShippingDiscount, setCurrentShippingDiscount] = useState<any>(
    discountsDict[productId]?.shippingDiscount ?? null,
  );

  const productVouchers = useMemo(
    () => discounts.filter((d) => d.type === 'product'),
    [discounts],
  );
  const shippingVouchers = useMemo(
    () => discounts.filter((d) => d.type === 'shipping'),
    [discounts],
  );

  const findVoucherByCode = (list: any[], code: string) =>
    list.find((v) => v.code === code) ?? null;

  const mergedVouchers = (base: any[], current: any) => {
    if (!current || base.find((v) => v.code === current.code)) return base;
    return [current, ...base];
  };

  const finalProductOptions = useMemo(
    () => mergedVouchers(productVouchers, currentProductDiscount),
    [productVouchers, currentProductDiscount],
  );

  const finalShippingOptions = useMemo(
    () => mergedVouchers(shippingVouchers, currentShippingDiscount),
    [shippingVouchers, currentShippingDiscount],
  );

  const handleConfirm = () => {
    setDictionary(productId, currentProductDiscount, currentShippingDiscount);
    modal.hide();
  };

  return (
    <Dialog {...muiDialogV5(modal)} maxWidth="md" fullWidth>
      <DialogTitle>Chọn mã giảm giá cho sản phẩm {productName}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} mt={1}>
          <FormControl fullWidth>
            <InputLabel>Mã giảm giá sản phẩm</InputLabel>
            <Select
              value={currentProductDiscount?.code ?? ''}
              label="Mã giảm giá sản phẩm"
              onChange={(e) =>
                setCurrentProductDiscount(
                  findVoucherByCode(productVouchers, e.target.value),
                )
              }
            >
              <MenuItem value="">Không áp dụng</MenuItem>
              {finalProductOptions.map((v) => (
                <MenuItem key={v.id} value={v.code}>
                  <Stack spacing={0.5}>
                    <Typography variant="body2">
                      {v.discountCalculationMethod === 'percentage'
                        ? `Giảm ${v.discountQuantity}%`
                        : `Giảm ${v.discountQuantity?.toLocaleString()}₫`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {v.code}
                    </Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Mã giảm giá vận chuyển</InputLabel>
            <Select
              value={currentShippingDiscount?.code ?? ''}
              label="Mã giảm giá vận chuyển"
              onChange={(e) =>
                setCurrentShippingDiscount(
                  findVoucherByCode(shippingVouchers, e.target.value),
                )
              }
            >
              <MenuItem value="">Không áp dụng</MenuItem>
              {finalShippingOptions.map((v) => (
                <MenuItem key={v.id} value={v.code}>
                  <Stack spacing={0.5}>
                    <Typography variant="body2">
                      {v.type === 'percentage'
                        ? `Giảm ${v.discountQuantity}%`
                        : `Giảm ${v.discountQuantity?.toLocaleString()}₫`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {v.code}
                    </Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => modal.hide()}>Hủy</Button>
        <Button onClick={handleConfirm} variant="contained">
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default VoucherDialog;
