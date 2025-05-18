// src/context/store/store.reducer.ts
import { IContextAction } from '@/services/common/common.model';
import { TStoreState, TStoreActionType, IStore } from './store.model';

const storeReducer = (
    state: TStoreState,
    action: IContextAction<TStoreActionType>,
): TStoreState => {
    switch (action.type) {
        case 'SET_STORE': {
            const store = action.payload as IStore;
            return {
                store,
                isChosen: true,
            };
        }

        case 'CLEAR_STORE': {
            return {
                store: null,
                isChosen: false,
            };
        }

        default:
            return state;
    }
};

export default storeReducer;
