import { IContextAction } from '../common/common.model';
import { IAuthState, TAuthActionType } from './auth.model';

const authReducer = (
  state: IAuthState,
  action: IContextAction<TAuthActionType>,
): IAuthState => {
  switch (action.type) {
    case 'logout': {
      return {
        ...state,
        isAuth: false,
        currentUser: undefined,
      };
    }

    case 'setIsAuth': {
      return {
        ...state,
        isAuth: action.payload,
      };
    }

    case 'setCurrentUser': {
      return {
        ...state,
        currentUser: action.payload,
      };
    }

    default:
      return state;
  }
};

export default authReducer;
