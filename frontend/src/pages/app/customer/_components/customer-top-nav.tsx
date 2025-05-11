'use client';

import { useState } from 'react';
import { 
  Autocomplete,
  InputBase,
  IconButton,
  styled,
  alpha,
  Avatar,
  Paper,
  Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery } from '@tanstack/react-query';
import productsService from '@/pages/app/customer/_services/product.service';
import useDebounce from '@/hooks/use-debounce';
import usePopover from '@/hooks/use-popover';
import AccountPopover from '../../_components/account-popover';
import './custom-top-nav.scss';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  storeId: string;
  images: string[];
}

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
  const [inputValue, setInputValue] = useState<string>('');
  const debouncedKeyword = useDebounce(inputValue, 300);
  const accountPopover = usePopover();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['products/getAll/accessories', debouncedKeyword],
    queryFn: () =>
      productsService.getAll({
        maxResultCount: 1000,
        keyword: debouncedKeyword || '',
      }),
    enabled: debouncedKeyword.length > 0,
  });

  return (
    <div className="w-full bg-[#e46842] px-4 md:px-10 py-3 flex flex-wrap items-center justify-between gap-y-3 text-white">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-400 rounded-sm" />
        <span className="font-bold text-base md:text-lg">
          <span className="text-yellow-400 top-nav-group-name">The Gears Men</span>
        </span>
      </div>

      {/* Search input */}
      <div className="relative flex flex-1 mx-0 md:mx-10 w-full md:w-auto">
        <Autocomplete
          freeSolo
          options={products || []}
          getOptionLabel={(option) => 
            typeof option === 'string' ? option : option.name
          }
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => {
            setInputValue(newInputValue);
          }}
          loading={isLoading}
          PaperComponent={(props) => (
            <Paper 
              {...props} 
              className="mt-1 shadow-lg"
              sx={{
                '& .MuiAutocomplete-listbox': {
                  maxHeight: 300,
                  py: 0
                }
              }}
            />
          )}
          renderInput={(params) => (
            <div ref={params.InputProps.ref} className="flex bg-white rounded overflow-hidden w-full">
              <InputBase
                {...params.inputProps}
                placeholder="Tìm kiếm sản phẩm…"
                className="px-3 py-1.5 text-sm text-gray-700 flex-1"
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
          )}
          renderOption={(props, option) => (
            <li {...props} className="px-3 py-2 hover:bg-gray-100">
              <div className="w-full">
                <div className="font-medium">{option.name}</div>
                <div className="text-sm text-gray-500">
                  {option.price.toLocaleString()}đ • {option.category}
                </div>
              </div>
            </li>
          )}
          sx={{
            flex: 1,
            '& .MuiAutocomplete-endAdornment': {
              right: 56,
              top: '50%',
              transform: 'translateY(-50%)'
            },
            '& .MuiAutocomplete-clearIndicator': {
              display: 'none' // Ẩn nút clear mặc định
            }
          }}
        />
      </div>

      {/* Tài khoản */}
      <div className="flex flex-col items-center text-xs md:text-sm mr-3">
        <IconButton
          style={{ padding: 0 }}
          onClick={accountPopover.handleOpen}
          ref={accountPopover.anchorRef}
        >
          <AvatarStyled src={''} />
        </IconButton>
      </div>

      <AccountPopover
        anchorEl={accountPopover.anchorRef.current}
        open={accountPopover.open}
        onClose={accountPopover.handleClose}
      />

      {/* Giỏ hàng */}
      <div>
        <div className="border border-white rounded px-2 py-1 flex items-center gap-1 text-sm top-nav-cart">
          <i className="fas fa-lock" />
          <span>Giỏ hàng</span>
          <span className="bg-yellow-400 text-[#e4572e] rounded-full text-xs px-2 py-0.5 font-bold">
            0
          </span>
        </div>
      </div>
    </div>
  );
}