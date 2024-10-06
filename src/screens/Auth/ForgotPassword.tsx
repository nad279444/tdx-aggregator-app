import React, { useState,useContext,useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ToastAndroid, ActivityIndicator} from 'react-native';
import PasswordInput from '../../_components/PasswordInput';
import auth from '../../controllers/auth/auth';
import { AuthContext } from '../../../AuthContext';
import {Ionicons} from '@expo/vector-icons'

export default function ForgotPassword({ navigation }) {

  useEffect(() => {
    navigation.setOptions({
      title: 'Forgot Password',
      headerTitleAlign: 'center',
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 16 }}
        >
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isLoading,setIsLoading] = useState(false)
  const {authContext} = useContext(AuthContext)
  

  const validatePhone = (input) => {
    const phoneRegex = /^\d{10}$/; // Exactly 10 digits
    return phoneRegex.test(input);
  };
  

  async function handleReset() {
    setIsLoading(true)
    try {
      const response = await auth.forgotPassword({
        mobile:phoneNumber,
    

    });
      if (!response.error) {
        ToastAndroid.showWithGravityAndOffset(
          response.challenge,
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          25,
          50,
        );
      }
      ToastAndroid.showWithGravityAndOffset(
        response.message,
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        25,
        50,
      );
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        25,
        50,
      );
    }finally{
      setIsLoading(false)
    }
    navigation.navigate('OTPScreen',{mobile:phoneNumber});
    setPhoneNumber('');
    
  }

  const handlePhoneChange = (input) => {
    setPhoneNumber(input);
    if (validatePhone(input)) {
      setPhoneError('');
    } else {
      setPhoneError('✗ Invalid phone number.');
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
    
        <Text style={styles.title}>Kindly Provide Your Mobile Number</Text>
         <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputTitle}>Phone Number</Text>
          <TextInput
            style={styles.nameInput}
            textAlign="left"
            placeholder="Enter Your Phone Number"
            onChangeText={handlePhoneChange}
            keyboardType="numeric"
            value={phoneNumber}
          />
        </View>
      </View>
        
        {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
    
        <TouchableOpacity
        style={phoneNumber ? styles.greenButton : styles.disabledButton}
        onPress={handleReset}
        disabled={ !phoneNumber || isLoading}
      >
        <Text style={{ fontSize: 18, color: "white" }}>
          Send
        </Text>
        {isLoading &&   <ActivityIndicator style={{position: 'absolute',top: 15, right: 40}} size="small" color="#fff" />}
      </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    inputContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
      position: 'relative'
    },
    inputGroup: {
      flex: 1,
      position: "relative",
    },
    inputTitle: {
      marginLeft: 10,
      marginBottom: 4,
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
    },
    visibleIcon : {
      position: 'absolute',
      top: 50,
      right:30
    },
    nameInput: {
      height: 60,
      borderWidth: 1,
      borderColor: "#FFFFFF",
      borderRadius: 4,
      padding: 10,
      marginHorizontal: 10,
      textAlign: "right",
      backgroundColor: "#FFFFFF",
    },
    passwordWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
    },
    validationContainer: {
      marginTop: 10,
      marginLeft: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 4,
      color: 'green',
      marginLeft:10,
      paddingTop: 20
    },
    label: {
      fontSize: 14,
      marginBottom: 20,
      marginLeft: 10
    },
    greenButton: {
      backgroundColor: "#21893E",
      marginVertical: 50,
      height: 50,
      marginHorizontal: 25,
      borderWidth: 1,
      borderColor: "#D5D8DE",
      borderRadius: 4,
      paddingVertical: 10,
      alignItems: "center",
    },
    disabledButton: {
      marginVertical: 50,
      height: 50,
      marginHorizontal: 10,
      borderWidth: 1,
      borderColor: "#D5D8DE",
      borderRadius: 4,
      paddingVertical: 10,
      backgroundColor: "#D5D8DE",
      alignItems: "center",
    },
    errorText: {
      color: 'red',
      marginLeft: 10,
      marginTop: 5,
    },
  })