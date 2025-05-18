import { GlobalScrollbar } from 'mac-scrollbar';
import { RouterProvider } from 'react-router-dom';

import BaseLayout from './components/base-layout';
import ThemeRegistry from './components/theme-registry/theme-registry';
import { router } from './configs/router.config';
import ReactQueryProvider from './react-query/provider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


const App = () => {
  return (
    <ReactQueryProvider>
      <ThemeRegistry>
        <BaseLayout>
          <RouterProvider router={router} />
        </BaseLayout>
        <GlobalScrollbar />
      </ThemeRegistry>
      <ReactQueryDevtools initialIsOpen={true} />
    </ReactQueryProvider>
  );
};

export default App;
