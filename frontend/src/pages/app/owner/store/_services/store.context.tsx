import {
  Dispatch,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import { IContextAction } from '@/services/common/common.model';

import { TStoreActionType, TStoreState } from './store.model';
import storeReducer from './store.reducer';

const STORE_KEY = 'selected_store';

const initialState: TStoreState = {
  store: null,
  isChosen: false,
};

export const StoreContext = createContext<
  [TStoreState, Dispatch<IContextAction<TStoreActionType>>]
>([initialState, () => null]);

function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(
    storeReducer,
    initialState,
    (initial) => {
      if (typeof window === 'undefined') return initial;

      try {
        const stored = localStorage.getItem(STORE_KEY);
        if (stored) return JSON.parse(stored) as TStoreState;
      } catch (err) {
        console.error('Failed to parse store from localStorage', err);
      }
      return initial;
    },
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Failed to save store to localStorage', err);
    }
  }, [state]);

  return (
    <StoreContext.Provider value={[state, dispatch]}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
export default StoreProvider;
