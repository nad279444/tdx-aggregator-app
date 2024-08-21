import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SuccessScreen = ({ route, navigation }) => {
    const { message, firstname, accessToken } = route.params; // Access the message passed from navigation
    const handleLogin = () => {
    // Here you can set the token and log the user in
    // For example, you can save the token to AsyncStorage and navigate to the home screen
    // console.log('Logging in with token:', accessToken);
    // AsyncStorage.setItem('userToken', accessToken);
    navigation.navigate('SignIn');
    };
  
  return (
    <View style={styles.container}>
      <FontAwesome5 name="check-circle" size={100} color="#006400" />
      <Text style={styles.title}> Congratulations !!</Text>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 20,
    },
    message: {
      fontSize: 18,
      textAlign: 'center',
      paddingHorizontal: 20,
    },
    loginButton: {
      marginTop: 30,
      backgroundColor: '#fff', // White background
      borderWidth: 1,
      borderColor: '#006400', // Green border
      borderRadius: 25,
      width: 200,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: '#006400', // Green text
      fontSize: 20,
      fontWeight: 'bold',
    },
  });
  
  export default SuccessScreen;