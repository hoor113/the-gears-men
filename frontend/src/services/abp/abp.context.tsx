import React, { Dispatch, createContext, useReducer } from 'react';

import { IContextAction } from '@/services/common/common.model';

import { IAbpState, TAbpActionType } from './abp.model';
import abpReducer from './abp.reducer';

const initialState: IAbpState = {
  permissions: [],
};

export const AbpContext = createContext<
  [state: IAbpState, dispatch: Dispatch<IContextAction<TAbpActionType>>]
>([initialState, () => null]);

const AbpProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(abpReducer, initialState);

  return (
    <AbpContext.Provider value={[state, dispatch]}>
      {children}
    </AbpContext.Provider>
  );
};

export default AbpProvider;
