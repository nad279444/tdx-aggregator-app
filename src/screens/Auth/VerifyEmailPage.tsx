import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AuthController from '../../controllers/auth/AuthControlller';

const VerifyEmailPage = ({ navigation }) => {
  const [code, setCode] = useState('');
  const [verificationResult, setVerificationResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyCode = async () => {
    try {
      setLoading(true); // Set loading state to true when request is initiated
      const data = await AuthController.codeCheck({ code });
      setLoading(false); // Set loading state to false when request is completed
      if (data && data.status_code === 200){
        setVerificationResult('Verification successful');
        navigation.navigate("ResetPasswordPage",{code:data.code,email:data.email});
      } else {
        setVerificationResult('Verification failed');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      setVerificationResult('Verification failed');
      setLoading(false); // Ensure loading state is set to false in case of error
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter verification code </Text>
      <Text style={styles.label}>Please enter the verification code sent to you </Text>
      <TextInput
        style={styles.input}
        placeholder="Verification Code"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleVerifyCode} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Verify Code</Text>
        )}
      </TouchableOpacity>
      {verificationResult ? <Text>{verificationResult}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  button: {
    width: '100%',
    height: 50,
    backgroundColor: 'green', // Deep green color
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default VerifyEmailPage;