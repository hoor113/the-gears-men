export interface IStore {
    id: string;
    ownerId: string;
    name: string;
    description: string;
    location: string;
    products?: any[];
}

export type TStoreState = {
    store: IStore | null;
    isChosen: boolean;
};

export type TStoreActionType = 'SET_STORE' | 'CLEAR_STORE';