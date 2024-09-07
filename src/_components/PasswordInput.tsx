import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const PasswordInput = ({ password, setPassword, confirmPassword, setConfirmPassword, styles }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isValidLength, setIsValidLength] = useState(true);
  const [hasUppercase, setHasUppercase] = useState(true);
  const [hasLowercase, setHasLowercase] = useState(true);
  const [hasNumber, setHasNumber] = useState(true);
  const [hasSpecialChar, setHasSpecialChar] = useState(true);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
  const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

  const validatePassword = (value) => {
    const trimmedValue = value.trim();
    setPassword(trimmedValue);
    setIsValidLength(trimmedValue.length >= 8);
    setHasUppercase(/[A-Z]/.test(trimmedValue));
    setHasLowercase(/[a-z]/.test(trimmedValue));
    setHasNumber(/\d/.test(trimmedValue));
    setHasSpecialChar(/[!@#$%^&*(),.?":{}|<>]/.test(trimmedValue)); // Add special characters check
    setPasswordsMatch(confirmPassword === trimmedValue);
  };

  const validateConfirmPassword = (value) => {
    const trimmedValue = value.trim();
    setConfirmPassword(trimmedValue);
    setPasswordsMatch(password === trimmedValue);
  };

  return (
    <>
      {/* Main Password Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputTitle}>Password</Text>
          <TextInput
            style={styles.nameInput}
            textAlign="left"
            placeholder="Enter a strong password"
            onChangeText={(value) => {
              validatePassword(value);
              setPasswordTouched(true);
            }}
            secureTextEntry={!isPasswordVisible}
            value={password}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.visibleIcon}>
            <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.validationContainer}>
        {passwordTouched && !isValidLength && <Text style={{ color: 'red' }}>✗ At least 8 characters</Text>}
        {passwordTouched && !hasUppercase && <Text style={{ color: 'red' }}>✗ At least one uppercase letter</Text>}
        {passwordTouched && !hasLowercase && <Text style={{ color: 'red' }}>✗ At least one lowercase letter</Text>}
        {passwordTouched && !hasNumber && <Text style={{ color: 'red' }}>✗ At least one number</Text>}
        {passwordTouched && !hasSpecialChar && <Text style={{ color: 'red' }}>✗ At least one special character</Text>}
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputTitle}>Confirm Password</Text>
          <TextInput
            style={styles.nameInput}
            textAlign="left"
            placeholder="Confirm your password"
            onChangeText={(value) => {
              validateConfirmPassword(value);
              setConfirmPasswordTouched(true);
            }}
            secureTextEntry={!isConfirmPasswordVisible}
            value={confirmPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.visibleIcon}>
            <Ionicons name={isConfirmPasswordVisible ? 'eye-off' : 'eye'} size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.validationContainer}>
        {confirmPasswordTouched && !passwordsMatch && <Text style={{ color: 'red' }}>✗ Passwords do not match</Text>}
      </View>
    </>
  );
};

export default PasswordInput;
