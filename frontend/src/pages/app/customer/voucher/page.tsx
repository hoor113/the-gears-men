import { useQuery } from '@tanstack/react-query';
import { AbpContext } from '@/services/abp/abp.context';
import React, { useContext, useState } from 'react';
import voucherService from './_services/voucher.service';
import productsService from '../_services/product.service';
import { Container } from '@mui/material';
import Item from './_components/item';

const tabs = [
  { label: 'Tất cả Voucher', id: 'all' },
  { label: 'Voucher của tôi', id: 'mine' },
  { label: 'Sản phẩm giảm giá', id: 'discounts' },
];

const VoucherPage = () => {
  const [abpState] = useContext(AbpContext);
  const [activeTab, setActiveTab] = useState('all');

  let id = '';
  if (abpState.curLoginInfo) {
    id = abpState.curLoginInfo.id;
  }

  const { data: allVouchers } = useQuery({
    queryKey: ['discount-codes', 'GetAll'],
    queryFn: () => voucherService.getAll(),
  });

  const { data: discountProducts } = useQuery({
    queryKey: ['discount-products', 'GetDailyDiscount'],
    queryFn: () => productsService.getDailyDiscount(),
  });

  return (
    <Container maxWidth="lg">
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-4">
        <ul className="flex space-x-4">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-4 font-medium border-b-2 transition ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-blue-600 hover:border-blue-600'
                }`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-4 rounded shadow-sm">
        {activeTab === 'all' && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Tất cả Voucher</h2>
            <Item/>
          </div>
        )}
        {activeTab === 'mine' && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Voucher của tôi</h2>
            <Item/>
            {/* Hiển thị dữ liệu liên quan đến user nếu có */}
          </div>
        )}
        {activeTab === 'discounts' && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Sản phẩm giảm giá hôm nay</h2>
            <Item/>
          </div>
        )}
      </div>
    </Container>
  );
};

export default VoucherPage;
