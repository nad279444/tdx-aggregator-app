import LoginController from './src/controllers/auth/LoginController';
import React, {createContext, useState, useEffect, useReducer, useMemo} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid } from 'react-native';
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
          
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  const authContext = useMemo(
    () => ({
      signIn: async (email, password) => {
        try {
          let error_msg;
          if(email=="" || password ==""){
            error_msg = "Please enter email or password";
            ToastAndroid.showWithGravity(error_msg, ToastAndroid.SHORT, ToastAndroid.CENTER);
        }else{
          
          const { success, accessToken, message,udata,user_id } = await LoginController(email, password);
          if (success) {
            // If login succeeds, dispatch SIGN_IN action with the token
            dispatch({ type: 'SIGN_IN', token: accessToken });
            // Persist the token using AsyncStorage or any other storage mechanism
            await AsyncStorage.setItem('userToken', accessToken);
            await AsyncStorage.setItem('user_id', JSON.stringify(user_id));
            await AsyncStorage.setItem('user_data', JSON.stringify(udata));
            
          } else {
            // If login fails, display the error message
            console.error('Login failed:', message);
            ToastAndroid.showWithGravityAndOffset(
              message,
              ToastAndroid.LONG,
              ToastAndroid.TOP,
              0,
              200,
            );
          }
        }
        } catch (error) {
          console.error('Error during login:');
        }
      },
      signOut: async () => {
        // Remove the token from AsyncStorage or any other storage mechanism
        await AsyncStorage.removeItem('userToken');
        // Dispatch SIGN_OUT action
        dispatch({ type: 'SIGN_OUT' });
      },
    }),
    []
  );

  useEffect(() => {
    // Function to load token from storage and update the context
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.error('Error retrieving token:', e);
      }

      // Dispatch RESTORE_TOKEN action with the retrieved token
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  return (
    <AuthContext.Provider value={{ ...authContext, state }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;