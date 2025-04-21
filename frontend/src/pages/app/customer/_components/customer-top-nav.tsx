'use client';

import { useEffect, useState } from 'react';
import { InputBase, IconButton, styled, alpha, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery } from '@tanstack/react-query';
import productsService from '@/pages/app/customer/_services/product.service'; // service
import useDebounce from '@/hooks/use-debounce';// custom hook debounce
import usePopover from '@/hooks/use-popover';
import AccountPopover from '../../_components/account-popover';


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
    const [keyword, setKeyword] = useState('');
    const debouncedKeyword = useDebounce(keyword, 300);
    const accountPopover = usePopover();


    const { data: getAllAccessories } = useQuery({
        queryKey: ['products/getAll/accessories', debouncedKeyword],
        queryFn: () =>
            productsService.getAll({
                maxResultCount: 1000,
                keyword: debouncedKeyword || '',
            }),
        enabled: debouncedKeyword.length > 0,
    });

    useEffect(() => {
        if (getAllAccessories) {
            console.log('Search result:', getAllAccessories);
        }
    }, [getAllAccessories]);

    return (
        <div className="w-full bg-[#e46842] px-4 md:px-10 py-3 flex flex-wrap items-center justify-between gap-y-3 text-white">
            {/* Logo */}
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-400 rounded-sm" />
                <span className="font-bold text-base md:text-lg">
                    <span className="text-yellow-400">The Gears Men</span>
                </span>
            </div>

            {/* Search input */}
            <div className="flex flex-1 mx-0 md:mx-10 w-full md:w-auto">
                <div className="flex bg-white rounded overflow-hidden w-full">
                    <InputBase
                        placeholder="Tìm kiếm sản phẩm…"
                        className="px-3 py-1.5 text-sm text-gray-700 flex-1"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
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
                <div className="border border-white rounded px-2 py-1 flex items-center gap-1 text-sm">
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
