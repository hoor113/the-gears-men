// cart.reducer.ts
import { IContextAction } from '@/services/common/common.model';

import { TCartActionType, TCartItem, TCartState } from './cart.model';

const cartReducer = (
    state: TCartState,
    action: IContextAction<TCartActionType>,
): TCartState => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const cartItem = action.payload as TCartItem;
            const existing = state.items.find(
                (item: TCartItem) => item.id === cartItem.id,
            );
            if (existing) {
                return {
                    ...state,
                    items: state.items.map((item: TCartItem) =>
                        item.id === cartItem.id
                            ? { ...item, quantity: item.quantity + cartItem.quantity }
                            : item,
                    ),
                };
            }

            return {
                ...state,
                items: [...state.items, cartItem],
            };
        }

        case 'INCREASE_QUANTITY': {
            const id = action.payload as string;
            return {
                ...state,
                items: state.items.map((item: TCartItem) =>
                    item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
                ),
            };
        }

        case 'DECREASE_QUANTITY': {
            const id = action.payload as string;
            return {
                ...state,
                items: state.items.map((item: TCartItem) =>
                    item.id === id && item.quantity > 1
                        ? { ...item, quantity: item.quantity - 1 }
                        : item,
                ),
            };
        }

        case 'REMOVE_ITEM': {
            const id = action.payload as string;
            const filteredItems = state.items.filter(
                (item: TCartItem) => item.id !== id,
            );
            // Nếu item bị xóa là item cuối cùng (mảng còn lại rỗng), trả về mảng rỗng
            return {
                ...state,
                items: filteredItems.length === 0 ? [] : filteredItems,
            };
        }

        case 'FIX_QUANTITY': {
            const { id, quantity } = action.payload as {
                id: string;
                quantity: number;
            };
            return {
                ...state,
                items: state.items.map((item: TCartItem) =>
                    item.id === id ? { ...item, quantity } : item,
                ),
            };
        }

        case 'SET_CART': {
            const items = action.payload as TCartItem[];
            return {
                ...state,
                items: items.map((item: TCartItem) => ({
                    ...item,
                    quantity: item.quantity || 1,
                })),
            };
        }

        case 'CLEAR_CART': {
            return { items: [] };
        }

        default:
            return state;
    }
};

export default cartReducer;
