import { ApIConstant } from './actionTypes';

interface UsersState {
  data: unknown[];
  loading: boolean;
  error: string | null;
  message: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
}

interface UsersAction {
  type: string;
  data?: unknown;
  message?: string;
  payload?: unknown;
  key?: string;
}

const initialState: UsersState = {
  data: [],
  loading: false,
  error: null,
  status: 'idle',
  message: null,
};

function usersReducer(
  state: UsersState = initialState,
  action: UsersAction,
): UsersState {
  switch (action.type) {
    case ApIConstant.API_CREATE_USER_ACCOUNT_LOAD:
      return {
        ...state,
        loading: true,
        error: null,
        message: null,
        status: 'loading',
      };

    case ApIConstant.API_CREATE_USER_ACCOUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        data: Array.isArray(action.data) ? action.data : state.data,
        error: null,
        message: action.message ?? null,
        status: 'success',
      };

    case ApIConstant.API_CREATE_USER_ACCOUNT_ERROR:
      return {
        ...state,
        loading: false,
        error: typeof action.data === 'string' ? action.data : 'Request failed',
        message: null,
        status: 'error',
      };

    case ApIConstant.API_CREATE_USER_ACCOUNT_RESET:
      return {
        ...state,
        loading: false,
        error: null,
        message: null,
        status: 'idle',
      };

    case ApIConstant.UPDATE_LODING_STATE:
      return {
        ...state,
        loading: Boolean(action.data),
      };

    default:
      return state;
  }
}

export default usersReducer;
