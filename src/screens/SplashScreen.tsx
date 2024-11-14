import React, { useEffect} from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
// import AuthContext from '../../AuthContext';

const SplashScreen = (props) => {
  const navigation = useNavigation(); // Use the useNavigation hook here

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userToken = await SecureStore.getItemAsync('userToken');
        console.log('splah', userToken)
        if (userToken) {
          navigation.navigate('DashboardScreen');
        } else {
          navigation.navigate('Registration');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        navigation.navigate('Registration');
      }
    };
    

    checkAuth();
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="green" />
      <Text>Loading...</Text>
    </View>
  );
};

export default SplashScreen;