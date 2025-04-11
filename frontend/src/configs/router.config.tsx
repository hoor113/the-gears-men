import { createBrowserRouter } from 'react-router-dom';

import AdminPage from '@/pages/admin/index.page';
import AdminLayout from '@/pages/admin/layout';
import ReportOverViewPage from '@/pages/admin/reports/overview/page';
import MyAccountPage from '@/pages/admin/settings/my-account/index.page';

import AuthLayout from '@/pages/auth/layout';
import LoginPage from '@/pages/auth/login.page';
import NotFoundPage from '@/pages/not-found.page';
import SystemAccountsPage from '@/pages/admin/system/accounts/page';
import PublishersPage from '@/pages/admin/publishers/page';
import RolePage from '@/pages/admin/system/roles/page';
import BookPage from '@/pages/admin/books/page';
import AuthorsPage from '@/pages/admin/authors/page';
import CategoriesPage from '@/pages/admin/category/page';
import BookCopyPage from '@/pages/admin/books/[id]/page';
import SystemStaffsPage from '@/pages/admin/system/staffs/page';
import ChangePasswordPage from '@/pages/admin/settings/change-password/index.page';
import BookLoansPage from '@/pages/admin/bookLoans/page';
import FinesPage from '@/pages/admin/fines/page';
import BookClientPage from '@/pages/admin/client/books/page';
import BookLoansClientPage from '@/pages/admin/client/bookLoans/page';
import FinesClientPage from '@/pages/admin/client/fines/page';
import BookRequestsClientPage from '@/pages/admin/client/bookRequests/page';
import RegisterPage from '@/pages/auth/register.page';

export const router = createBrowserRouter([
  {
    path: '',
    element: <AdminLayout />,
    children: [
      { path: '/', element: <AdminPage /> },
      {
        path: '/settings',
        children: [
          { path: 'my-account', element: <MyAccountPage /> },
          { path: 'change-password', element: <ChangePasswordPage />},
        ],
      },
      {
        path: '/reports',
        children: [
          { path: 'overview', element: <ReportOverViewPage /> },
        ],
      },
      {
        path: '/system',
        children: [
          { path: 'accounts', element: <SystemAccountsPage /> },
          { path: 'roles', element: <RolePage /> },
          { path: 'staffs', element: <SystemStaffsPage /> },
        ]
      },
      {
        path: '/publishers',
        element: <PublishersPage />
      },
      {
        path: '/authors',
        element: <AuthorsPage />,
      },
      {
        path: '/categories',
        element: <CategoriesPage />,
      },
      {
        path: '/books',
        element: <BookPage />,
      },
      {
        path: '/books/:id',
        element: <BookCopyPage />,
      },
      {
        path: '/bookLoans',
        element: <BookLoansPage />,
      },
      {
        path: '/fines',
        element: <FinesPage/>,
      },
      {
        path: '/client/books',
        element: <BookClientPage />,
      },
      {
        path: '/client/bookLoans',
        element: <BookLoansClientPage />,
      },
      {
        path: '/client/fines',
        element: <FinesClientPage />
      },
      {
        path: '/client/bookRequests',
        element: <BookRequestsClientPage />,
      }
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
