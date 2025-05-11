import { createContext, Dispatch, useContext, useReducer, useEffect } from "react";
import { TCartActionType, TCartState } from "./cart.model";
import { IContextAction } from "@/services/common/common.model";
import cartReducer from "./cart.reducer";

const initialState: TCartState = {
    items: [],
};

export const CartContext = createContext<
    [state: TCartState, dispatch: Dispatch<IContextAction<TCartActionType>>]
>([initialState, () => null]);

function CartProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, initialState, (initial) => {
        const storedState = localStorage.getItem("cartState");
        if (storedState) {
            return JSON.parse(storedState);
        }
        return initial;
    });

    // Lưu trạng thái vào localStorage khi state thay đổi
    useEffect(() => {
        if (state.items.length > 0) {
            localStorage.setItem("cartState", JSON.stringify(state));
        }
    }, [state]);

    return (
        <CartContext.Provider value={[state, dispatch]}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
export default CartProvider;
