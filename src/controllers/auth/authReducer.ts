
export const initialState = {
    isLoading: true,
    isSignout: false,
    userToken: null,
  };
  
  export function authReducer(state, action) {
    switch (action.type) {
      case 'RESTORE_TOKEN':
        return {
          ...state,
          userToken: action.token,
          isLoading: false,
        };
      case 'SIGN_IN':
        return {
          ...state,
          isSignout: false,
          userToken: action.token,
        };
      case 'SIGN_OUT':
        return {
          ...state,
          isSignout: true,
          userToken: null,
        };
      default:
        return state;
    }
  }
  