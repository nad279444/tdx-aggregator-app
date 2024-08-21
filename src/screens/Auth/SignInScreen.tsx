import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AuthContext from '../../../AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const { signIn } = useContext(AuthContext);

  const validateEmailOrPhone = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{10,14}$/;
    return emailRegex.test(input) || phoneRegex.test(input);
  };

  const handleLogin = async () => {
    if (!validateEmailOrPhone(email)) {
      Alert.alert('Invalid Input', 'Please enter a valid email address or phone number.');
      return;
    }
    setIsLoading(true); // Start loading
    try {
      await signIn(email, password, navigation);
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/icon.png')} style={styles.logo} />
      <Text style={styles.welcomeText}>Welcome to TDX Aggregator Platform</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone or E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone or E-mail"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeIconContainer}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Icon
              name={isPasswordVisible ? 'eye' : 'eye-slash'}
              size={20}
              color="black"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* Render loading indicator while loading */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#006400" style={styles.loadingIndicator} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordPage')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('RegisterPage')}>
        <Text style={styles.signUp}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
    zIndex: 1,
  },
  eyeIcon: {
    marginHorizontal: 5,
  },
  forgotPassword: {
    marginTop: 20,
    textDecorationLine: 'underline',
    color: 'green',
    fontWeight:'bold',
  },
  signUp: {
    marginTop: 20,
    color: 'green',
    fontWeight:'bold',
    // color: '#0066cc',
  },
  button: {
    width: 350,
    height: 50,
    backgroundColor: '#006400',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginTop: 20,
  },
});
