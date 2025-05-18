import { createBrowserRouter } from 'react-router-dom';

import AdminLayout from '@/pages/app/admin/layout';
import AdminPage from '@/pages/app/admin/page';
import SystemAccountsPage from '@/pages/app/admin/system/accounts/page';
import CompanyLayout from '@/pages/app/company/layout';
import CompanyPage from '@/pages/app/company/page';
import CartPage from '@/pages/app/customer/cart/page';
import CustomerLayout from '@/pages/app/customer/layout';
import CustomerPage from '@/pages/app/customer/page';
import SingleProductPage from '@/pages/app/customer/product/[id]/page';
import VoucherPage from '@/pages/app/customer/voucher/page';
import HomePage from '@/pages/app/index.page';
import AppLayout from '@/pages/app/layout';
import OwnerLayout from '@/pages/app/owner/layout';
import OwnerPage from '@/pages/app/owner/page';
import SuccessPage from '@/pages/app/customer/payment/success/index.page';
import SuccessLayout from '@/pages/app/customer/payment/success/layout';
import FailPage from '@/pages/app/customer/payment/fail/index.page';
import FailLayout from '@/pages/app/customer/payment/fail/layout';
import CheckoutPage from '@/pages/app/customer/payment/page';
import PersonnelLayout from '@/pages/app/personnel/layout';
import PersonnelPage from '@/pages/app/personnel/page';
import ChangePasswordPage from '@/pages/app/settings/change-password/index.page';
import MyAccountPage from '@/pages/app/settings/my-account/index.page';
import AuthLayout from '@/pages/auth/layout';
import LoginPage from '@/pages/auth/login.page';
import RegisterPage from '@/pages/auth/register.page';
import NotFoundPage from '@/pages/not-found.page';
import OrderHistoryPage from '@/pages/app/customer/history/page';
import AboutUs from '@/pages/app/customer/_components/aboutus';

export const router = createBrowserRouter([
  {
    path: '',
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminPage />,
          },
          {
            path: 'system',
            children: [{ path: 'accounts', element: <SystemAccountsPage /> }],
          },
        ],
      },
      {
        path: '/customer',
        element: <CustomerLayout />,
        children: [
          {
            index: true,
            element: <CustomerPage />,
          },
          {
            path: 'product/:id',
            element: <SingleProductPage />,
          },
          {
            path: 'vouchers',
            element: <VoucherPage />,
          },
          {
            path: 'order-history',
            element: <OrderHistoryPage />,
          }, 
          {
            path: 'cart',
            element: <CartPage />,
          },
          {
            path: 'aboutus',
            element: <AboutUs/>
          },
          {
            path: 'payment',
            children: [
              {
                index: true,
                element: <CheckoutPage />,
              },
              {
                path: 'success',
                element: <SuccessLayout />,
                children: [
                  {
                    index: true,
                    element: <SuccessPage />,
                  },
                ],
              },
              {
                path: 'fail',
                element: <FailLayout />,
                children: [
                  {
                    index: true,
                    element: <FailPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: '/owner',
        element: <OwnerLayout />,
        children: [
          {
            index: true,
            element: <OwnerPage />,
          },
        ],
      },
      {
        path: '/company',
        element: <CompanyLayout />,
        children: [
          {
            index: true,
            element: <CompanyPage />,
          },
        ],
      },
      {
        path: '/personnel',
        element: <PersonnelLayout />,
        children: [
          {
            index: true,
            element: <PersonnelPage />,
          },
        ],
      },
      {
        path: 'settings',
        children: [
          { path: 'my-account', element: <MyAccountPage /> },
          { path: 'change-password', element: <ChangePasswordPage /> },
        ],
      },
    ],
  },
  {
    path: 'auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
  { path: '/404', element: <NotFoundPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
