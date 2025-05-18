import { Product } from '../../_services/product.model';

export type TCartItem = Product & { quantity: number };

export type TCartState = {
  items: TCartItem[];
};

export type TCartActionType =
  | 'ADD_ITEM'
  | 'REMOVE_ITEM'
  | 'CLEAR_CART'
  | 'INCREASE_QUANTITY'
  | 'DECREASE_QUANTITY'
  | 'FIX_QUANTITY'
  | 'SET_CART';
