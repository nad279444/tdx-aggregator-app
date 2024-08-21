import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid, ActivityIndicator } from 'react-native';
import AuthController from '../../controllers/auth/AuthControlller';

const ForgotPasswordPage = ({ navigation }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const validateInput = (value) => {
    const phoneNumberRegex = /^(\+233|0)[0-9]{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return phoneNumberRegex.test(value) || emailRegex.test(value);
  };

  const handleForgotPassword = async () => {
    if (validateInput(input)) {
      setLoading(true); // Set loading state to true when request is initiated
      const response = await AuthController.forgotPassword(input);
      setLoading(false); // Set loading state to false when request is completed
      if (response.status_code==200) {
        // Handle success
        ToastAndroid.showWithGravity(response.message, ToastAndroid.SHORT, ToastAndroid.CENTER);
        // console.log(response.message);
        navigation.navigate('VerifyEmailPage');
      } else {
        // Handle error
        ToastAndroid.showWithGravity(response.message, ToastAndroid.SHORT, ToastAndroid.CENTER);
        // console.error(response.message);
      }
    } else {
      // Handle invalid input
      ToastAndroid.showWithGravity('Please provide a valid email address or phone number', ToastAndroid.SHORT, ToastAndroid.CENTER);
      console.error('Please provide a valid email address or phone number');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.label}>Enter your email or phone number to reset your password</Text>
      <TextInput
        style={styles.input}
        placeholder="Email or phone number"
        value={input}
        onChangeText={setInput}
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={handleForgotPassword} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.rsbtnText}>Submit Request</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  rsbtnText: {
    color: '#fff',
  },
  button: {
    width: 350,
    height: 50,
    backgroundColor: 'green', // Deep green color
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});

export default ForgotPasswordPage;
