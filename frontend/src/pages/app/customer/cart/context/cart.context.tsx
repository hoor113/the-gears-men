import {
  Dispatch,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import { IContextAction } from '@/services/common/common.model';

import { TCartActionType, TCartState } from './cart.model';
import cartReducer from './cart.reducer';

const initialState: TCartState = {
  items: [],
};

export const CartContext = createContext<
  [state: TCartState, dispatch: Dispatch<IContextAction<TCartActionType>>]
>([initialState, () => null]);

function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, (initial) => {
    const storedState = localStorage.getItem('cartState');
    if (storedState) {
      return JSON.parse(storedState);
    }
    return initial;
  });

  // Lưu trạng thái vào localStorage khi state thay đổi
  useEffect(() => {
    localStorage.setItem('cartState', JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider value={[state, dispatch]}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
export default CartProvider;
