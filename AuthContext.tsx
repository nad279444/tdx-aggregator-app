// contexts/AuthContext.js
import React, { createContext, useMemo, useReducer, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import auth from './src/controllers/auth/auth';

import { authReducer, initialState } from './src/controllers/auth/authReducer';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        // Handle error
      }

      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async (authResponse) => {
         console.log(authResponse.access_token)
        if (authResponse.token) {
          await SecureStore.setItemAsync('userToken', authResponse.token);
          await SecureStore.setItemAsync('accessToken',authResponse.access_token)

          dispatch({ type: 'SIGN_IN', token: authResponse.token });
          
        } else {
          console.error(authResponse.message); // Handle error appropriately
        }
      },
      signOut: async () => {
         await auth.signOut()
        dispatch({ type: 'SIGN_OUT' });
      },
     
    }),
    []
  );

  return (
    <AuthContext.Provider value={{ state, authContext }}>
      {children}
    </AuthContext.Provider>
  );
}
