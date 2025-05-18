import { RemoveCircle } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import {
  Avatar,
  Badge,
  Box,
  Button,
  ClickAwayListener,
  Divider,
  IconButton,
  InputBase,
  Paper,
  Popover,
  Typography,
  alpha,
  styled,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useDebounce from '@/hooks/use-debounce';
import usePopover from '@/hooks/use-popover';
import productsService from '@/pages/app/customer/_services/product.service';

import AccountPopover from '../../_components/account-popover';
import { useCart } from '../cart/context/cart.context';
import './custom-top-nav.scss';
import LeftDrawer from './left-drawer';

const AvatarStyled = styled(Avatar)(({ theme }) => ({
  border: `1px solid ${alpha(theme.palette.primary.main, 0.6)}`,
  flexShrink: 0,
  height: 45,
  width: 45,
  padding: 2,
  '& > img': {
    borderRadius: '50%',
  },
}));

export default function CustomerTopNav() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 300);
  const accountPopover = usePopover();
  const [cartState, cartDispatch] = useCart();
  const [cartAnchorEl, setCartAnchorEl] = useState<null | HTMLElement>(null);
  const [searchResultOpen, setSearchResultOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentCartState = useMemo(() => cartState, [cartState]);

  const handleCartClose = () => {
    setCartAnchorEl(null);
  };

  const handleCartItemRemove = (id: any) => {
    cartDispatch({ type: 'REMOVE_ITEM', payload: { id: id } });
    currentCartState.items = currentCartState.items.filter(
      (item) => item.id !== id,
    );
    if (currentCartState.items.length === 0) {
      cartDispatch({ type: 'CLEAR_CART' });
    }
  };

  const isCartOpen = Boolean(cartAnchorEl);
  const totalItems = useMemo(
    () => cartState.items.reduce((sum, item) => sum + item.quantity, 0),
    [currentCartState.items, cartState.items],
  );
  const totalPrice = useMemo(
    () =>
      cartState.items.reduce(
        (sum, item) =>
          sum +
          ((item.priceAfterDiscount != null ? item.priceAfterDiscount : item.price) *
            item.quantity),
        0,
      ),
    [currentCartState.items, cartState.items],
  );

  const { data: getAllAccessories } = useQuery({
    queryKey: ['products/getAll/accessories', debouncedKeyword],
    queryFn: () =>
      productsService.getAll({
        maxResultCount: 1000,
        keyword: debouncedKeyword || '',
      }),
    enabled: debouncedKeyword.length > 0,
  }) as any;

  useEffect(() => {
    if (getAllAccessories) {
      console.log('Search result:', getAllAccessories);
    }
  }, [getAllAccessories]);

  const handleSearchBlur = () => {
    setSearchResultOpen(false);
  };

  const handleSearchFocus = () => {
    setSearchResultOpen(true);
  };

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  return (
    <div className="w-full bg-[#e46842] px-4 md:px-10 py-3 flex justify-between items-center gap-y-3 text-white relative">
      {/* Vùng bên trái (Tiêu đề và Thanh tìm kiếm) */}
      <div className="flex items-center gap-x-4 w-2/3">
        {/* Menu Drawer */}
        <IconButton onClick={() => toggleDrawer(true)} sx={{ color: 'white' }}>
          <MenuIcon />
        </IconButton>

        <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-400 rounded-sm" />
        <span className="font-bold text-base md:text-lg">
          <span className="text-yellow-400 top-nav-group-name">
            The Gears Men
          </span>
        </span>

        {/* Thanh tìm kiếm */}
        <ClickAwayListener onClickAway={handleSearchBlur}>
          <div className="relative w-1/2 ml-8">
            <div className="flex bg-white rounded overflow-hidden w-full">
              <InputBase
                placeholder="Tìm kiếm sản phẩm…"
                className="px-3 py-1.5 text-sm text-gray-700 flex-1"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onFocus={handleSearchFocus}
              />
              <IconButton
                sx={{
                  bgcolor: '#fdd835',
                  borderRadius: 0,
                  '&:hover': { bgcolor: '#fbc02d' },
                  padding: '8px 12px',
                }}
              >
                <SearchIcon sx={{ color: '#fff' }} />
              </IconButton>
            </div>

            {searchResultOpen && debouncedKeyword && (
              <Paper
                elevation={4}
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 10,
                  mt: 1,
                  maxHeight: 300,
                  overflowY: 'auto',
                  borderRadius: 2,
                }}
              >
                {getAllAccessories?.length > 0 ? (
                  getAllAccessories.map((product: any) => {
                    const hasDiscount = product?.priceAfterDiscount != null;
                    const mainPrice = hasDiscount
                      ? product.priceAfterDiscount
                      : product.price;
                    const subPrice = hasDiscount ? product.price : null;

                    return (
                      <Box
                        key={product.id}
                        display="flex"
                        alignItems="center"
                        px={2}
                        py={1.5}
                        sx={{
                          '&:hover': { backgroundColor: '#f5f5f5' },
                          cursor: 'pointer',
                          borderBottom: '1px solid #eee',
                        }}
                      >
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 1,
                            overflow: 'hidden',
                            flexShrink: 0,
                            mr: 2,
                          }}
                        >
                          <img
                            src={
                              product.images?.[0] ||
                              '/assets/images/no-image.png'
                            }
                            alt={product.name}
                            width="100%"
                            height="100%"
                            style={{
                              objectFit: 'cover',
                              aspectRatio: '1 / 1',
                            }}
                          />
                        </Box>

                        <Box flex={1}>
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            noWrap
                          >
                            {product.name}
                          </Typography>

                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mt={0.5}
                          >
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              color="primary.main"
                              sx={{ fontSize: 14 }}
                            >
                              {mainPrice?.toLocaleString('vi-VN')}₫
                            </Typography>
                            {subPrice && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  textDecoration: 'line-through',
                                  fontSize: 13,
                                }}
                              >
                                {subPrice.toLocaleString('vi-VN')}₫
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    );
                  })
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ p: 2, textAlign: 'center' }}
                  >
                    Không có kết quả
                  </Typography>
                )}
              </Paper>
            )}
          </div>
        </ClickAwayListener>
      </div>

      <div className="flex items-center gap-x-4">
        {/* Tài khoản */}
        <IconButton
          style={{ padding: 0 }}
          onClick={accountPopover.handleOpen}
          ref={accountPopover.anchorRef}
        >
          <AvatarStyled src={''} />
        </IconButton>

        <AccountPopover
          anchorEl={accountPopover.anchorRef.current}
          open={accountPopover.open}
          onClose={accountPopover.handleClose}
        />

        {/* Giỏ hàng */}
        <Box
          onMouseEnter={(e) => setCartAnchorEl(e.currentTarget)}
          onMouseLeave={handleCartClose}
          className="cursor-pointer"
        >
          <IconButton color="inherit">
            <Badge
              badgeContent={totalItems}
              color="warning"
              className="hover:cursor-pointer"
            >
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          <Popover
            open={isCartOpen}
            anchorEl={cartAnchorEl}
            onClose={handleCartClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: { width: 480, p: 2 },
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Giỏ hàng của bạn
            </Typography>

            {cartState.items.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Chưa có sản phẩm nào.
              </Typography>
            ) : (
              <>
                {currentCartState.items.map((item) => (
                  <Box
                    key={item.id}
                    display="flex"
                    gap={2}
                    mb={2}
                    pb={1.5}
                    sx={{ borderBottom: '1px solid #eee' }}
                  >
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 1,
                        overflow: 'hidden',
                        flexShrink: 0,
                        mr: 2,
                      }}
                    >
                      <img
                        src={item.images?.[0] || '/assets/images/no-image.png'}
                        alt={item.name}
                        width="100%"
                        height="100%"
                        style={{
                          objectFit: 'cover',
                          aspectRatio: '1 / 1',
                        }}
                      />
                    </Box>

                    <Box
                      flex={1}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Box>
                        <Typography variant="subtitle2" noWrap>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" mt={0.5}>
                          <span style={{ color: '#e46842', fontWeight: 600 }}>
                            {(item.priceAfterDiscount != null
                              ? item.priceAfterDiscount
                              : item.price
                            ).toLocaleString('vi-VN')}
                            ₫
                          </span>
                          {' x '}
                          <span>{item.quantity}</span>
                        </Typography>
                      </Box>

                      <IconButton
                        onClick={() => handleCartItemRemove(item.id)}
                        size="small"
                        sx={{ color: 'red' }}
                      >
                        <RemoveCircle />
                      </IconButton>
                    </Box>
                  </Box>
                ))}

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6" color="primary">
                    Tổng: {totalPrice.toLocaleString('vi-VN')}₫
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/customer/cart')}
                  >
                    Xem giỏ hàng
                  </Button>
                </Box>
              </>
            )}
          </Popover>
        </Box>
        <LeftDrawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
      </div>
    </div>
  );
}