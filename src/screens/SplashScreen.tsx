import React, { useEffect} from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
// import AuthContext from '../../AuthContext';

const SplashScreen = (props) => {
  const navigation = useNavigation(); // Use the useNavigation hook here

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if the user is authenticated
        const userToken = await AsyncStorage.getItem('userToken');

        if (userToken) {
          // User is authenticated, navigate to home page
          // props.navigation.push('StartScreen');
          navigation.navigate('StartScreen');
        } else {
          // User is not authenticated, navigate to authentication page
          // navigation.navigate('AuthPage');
          // console.error('Error is here');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // In case of error, navigate to authentication page as a fallback
        // navigation.navigate('AuthPage');
      }
    };

    checkAuth();
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Loading...</Text>
    </View>
  );
};

export default SplashScreen;