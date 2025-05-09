import { useQuery } from '@tanstack/react-query';
import { AbpContext } from '@/services/abp/abp.context';
import React, { useContext, useState } from 'react';
import voucherService from './_services/voucher.service';
import { Container } from '@mui/material';
import Item from './_components/item';

const tabs = [
  { label: 'Tất cả Voucher', id: 'all' },
  { label: 'Voucher của tôi', id: 'mine' },
];

const VoucherPage = () => {
  const [abpState] = useContext(AbpContext);
  const [activeTab, setActiveTab] = useState('all');

  // let id = '';
  // if (abpState.curLoginInfo) {
  //   id = abpState.curLoginInfo.id;
  // }

  const { data: allVouchers } = useQuery({
    queryKey: ['discount-codes', 'GetAll'],
    queryFn: () => voucherService.getAll(),
    enabled: activeTab === 'all', 
  });

  const { data: myVouchers } = useQuery({
    queryKey: ['discount-codes', 'customer'],
    queryFn: () => voucherService.getDiscountCodesOfCustomer(),
    enabled: activeTab === 'mine',
  });

  // console.log(myVouchers);
  // console.log(allVouchers);
  
  

  return (
    <Container maxWidth="lg">
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

      <div className="bg-white p-4 rounded shadow-sm">
        {activeTab === 'all' && (
          <div>
            <h2 className="text-3xl font-extrabold mb-4 text-gray-800">Tất cả Voucher</h2>
            {allVouchers?.map(item => (
              <Item isMyVoucher={true} voucherCode={item.code} key={item.id}/>
            ))}
          </div>
        )}
        {activeTab === 'mine' && (
          <div>
            <h2 className="text-3xl font-extrabold mb-4 text-gray-800">Voucher của tôi</h2>
            {myVouchers?.map(item => (
              <Item isMyVoucher={true} voucherCode={item.code} key={item.id}/>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default VoucherPage;