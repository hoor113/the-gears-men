import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

import { AbpContext } from '@/services/abp/abp.context';
import { abpService } from '@/services/abp/abp.service';
import { AuthContext } from '@/services/auth/auth.context';

const useAbp = () => {
  const [authState] = useContext(AuthContext);
  const [, abpDispatch] = useContext(AbpContext);

  const abpQuery = useQuery({
    enabled: authState.isAuth,
    queryKey: ['abp/getConfigurations'],
    queryFn: () => abpService.getConfigurations(),
    onSuccess: (configurations) => {
      abpDispatch({
        type: 'setPermissions',
        payload: Object.keys(configurations.auth.grantedPermissions),
      });
    },
  });

  const getCurLoginInfoQuery = useQuery({
    enabled: authState.isAuth,
    queryKey: ['abp/getCurLoginInfo'],
    queryFn: () => abpService.getCurLoginInfo(),
    onSuccess: (data) => {
      abpDispatch({
        type: 'setCurLoginInfo',
        payload: data,
      });
    },
  });

  return {
    abpQuery,
    getCurLoginInfoQuery,
  };
};

export default useAbp;
