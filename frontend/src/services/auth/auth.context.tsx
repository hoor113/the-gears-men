import React, { Dispatch, createContext, useReducer } from 'react';

import { IContextAction } from '../common/common.model';
import { IAuthState, TAuthActionType } from './auth.model';
import authReducer from './auth.reducer';

const initialState: IAuthState = {
  isAuth: false,
  currentUser: undefined,
};

export const AuthContext = createContext<
  [state: IAuthState, dispatch: Dispatch<IContextAction<TAuthActionType>>]
>([initialState, () => null]);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={[state, dispatch]}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
