import { IContextAction } from '@/services/common/common.model';

import { IAbpState, TAbpActionType } from './abp.model';

const abpReducer = (
  state: IAbpState,
  action: IContextAction<TAbpActionType>,
): IAbpState => {
  switch (action.type) {
    case 'setPermissions':
      return {
        ...state,
        permissions: action.payload,
      };

    case 'setCurLoginInfo':
      return {
        ...state,
        curLoginInfo: action.payload,
      };

    default:
      return state;
  }
};

export default abpReducer;
