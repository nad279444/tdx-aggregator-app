import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CompleteScreen = ({ route, navigation }) => {
    const { message, assignmentId, accessToken } = route.params; // Access the message passed from navigation
    const handleAssignNextFMR = () => {
    // Here you can set the token and log the user in
    // For example, you can save the token to AsyncStorage and navigate to the home screen
    // console.log('Logging in with token:', accessToken);
    // AsyncStorage.setItem('userToken', accessToken);
        navigation.navigate('CommodityListScreen');
    };

    const handleClose=()=>{
      navigation.navigate('CommodityListScreen');
    };
  
    return(
    <View style={styles.container}>
      <FontAwesome5 name="check-circle" size={60} color="#006400" />
      <Text style={styles.title}> Congratulations !! </Text>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity style={styles.nxtButton} onPress={handleAssignNextFMR}>
      <Text style={styles.buttonText}> Continue Aggregation </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.nxtButton2} onPress={handleClose}>
      <Text style={styles.buttonText2}>Close </Text>
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
    nxtButton: {
      marginTop: 30,
      backgroundColor: '#fff', // White background
      borderWidth: 1,
      borderColor: 'green', // Green border
      borderRadius: 2,
      color:"#fff",
      width:200,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    nxtButton2:{
      marginTop: 10,
      backgroundColor: 'green', // White background
      borderWidth: 1,
      borderColor: 'green', // Green border
      borderRadius: 2,
      width:200,
      height: 50,
      
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: '#006400', // Green text
      fontSize: 16,
      fontWeight: 'bold',
    },

    buttonText2: {
        color: '#fff', // Green text
        fontSize: 16,
        fontWeight: 'bold',
      },
  });
  
  export default CompleteScreen;