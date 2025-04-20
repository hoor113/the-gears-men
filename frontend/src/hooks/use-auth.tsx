import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

import { AuthContext } from '@/services/auth/auth.context';
import authService from '@/services/auth/auth.service';

const useAuth = () => {
  const [authState, authDispatch] = useContext(AuthContext);

  const authQuery = useQuery({
    enabled: !authState.isAuth,
    queryKey: ['auth/getUserInfo'],
    queryFn: () => authService.getUserInfo(),
    retry: false,
    onSuccess: (userData) => {
      authDispatch({ type: 'setIsAuth', payload: true });
      authDispatch({ type: 'setCurrentUser', payload: userData });
    },
    onError: () => {
      authDispatch({ type: 'setIsAuth', payload: false });
      authDispatch({ type: 'setCurrentUser', payload: undefined });
    },
  });

  return authQuery;
};

export default useAuth;
