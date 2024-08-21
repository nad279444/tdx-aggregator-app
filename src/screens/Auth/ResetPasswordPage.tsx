import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Assuming you are using FontAwesome icons
import AuthController from '../../controllers/auth/AuthControlller';

const ResetPasswordPage = ({ route, navigation }) => {
  const { email, code } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrengthPercentage, setPasswordStrengthPercentage] = useState(0);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [errorLocation, setErrorLocation] = useState('');

  // Calculate password strength percentage
  const calculatePasswordStrength = (newPassword) => {
    let strength = 0;
    // Minimum 8 characters
    if (newPassword.length >= 8) strength += 1;
    // Contains at least one digit
    if (/\d/.test(newPassword)) strength += 1;
    // Contains at least one letter
    if (/[a-zA-Z]/.test(newPassword)) strength += 1;
    // Bonus for length over 12
    if (newPassword.length >= 12) strength += 1;

    const strengthPercentage = (strength / 4) * 100;
    return strengthPercentage;
  };

  const handlePasswordChange = (newPassword) => {
    setPassword(newPassword);
    const strengthPercentage = calculatePasswordStrength(newPassword);
    setPasswordStrengthPercentage(strengthPercentage);

    if (strengthPercentage === 100) {
      setErrorMessage('');
    } else {
      setErrorMessage('Password must be alphanumeric and at least 8 characters long.');
    }
  };

  const handleConfirmPasswordChange = (newConfirmPassword) => {
    setConfirmPassword(newConfirmPassword);
    setPasswordsMatch(newConfirmPassword === password);
  };

  const handleResetPassword = async () => {
    if (!code || !password || !confirmPassword) {
      setErrorMessage('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const passwordData = { email, code, password, password_confirmation: confirmPassword };
      const response = await AuthController.resetPassword(passwordData);

      if (response.status_code === 200) {
        ToastAndroid.showWithGravity(response.message, ToastAndroid.SHORT, ToastAndroid.CENTER);
        navigation.navigate('SignIn');
      }else{
        setErrorMessage(response.message);
        ToastAndroid.showWithGravity(response.message, ToastAndroid.SHORT, ToastAndroid.CENTER);
        
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.label}>Verified: {email}</Text>

      {/* New Password */}
      <Text style={styles.inputLabel}>New Password <Text style={{ color: (errorLocation === 'password') ? 'red' : 'black' }}>*</Text></Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter new password"
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={handlePasswordChange}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.eyeIconContainer}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          <Icon
            name={isPasswordVisible ? 'eye' : 'eye-slash'}
            size={20}
            color="black"
          />
        </TouchableOpacity>
      </View>

      {/* Password Strength */}
      {password && (
        <View>
          <View style={styles.passwordStrengthContainer}>
            <Text style={[styles.passwordStrength, { color: passwordStrengthPercentage === 100 ? 'green' : (passwordStrengthPercentage >= 0 && passwordStrengthPercentage <= 50 ? 'red' : 'orange') }]}>
              {passwordStrengthPercentage === 100 ? 'Strong' : 'Weak'}
            </Text>
            <Text style={[styles.passwordStrengthPercentage, { color: passwordStrengthPercentage === 100 ? 'green' : (passwordStrengthPercentage >= 0 && passwordStrengthPercentage <= 50 ? 'red' : 'orange') }]}>
              {passwordStrengthPercentage}%
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  backgroundColor: passwordStrengthPercentage === 100 ? 'green' : (passwordStrengthPercentage >= 0 && passwordStrengthPercentage <= 50 ? 'red' : 'orange'),
                  width: `${passwordStrengthPercentage}%`
                }
              ]}
            />
          </View>
        </View>
      )}

      {/* Confirm Password */}
      <Text style={styles.inputLabel}>Confirm Password <Text style={{ color: (errorLocation === 'confirmPassword') ? 'red' : 'black' }}>*</Text></Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          secureTextEntry={!isConfirmPasswordVisible}
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.eyeIconContainer}
          onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
        >
          <Icon
            name={isConfirmPasswordVisible ? 'eye' : 'eye-slash'}
            size={20}
            color="black"
          />
        </TouchableOpacity>
      </View>

      {/* Passwords do not match error */}
      {!passwordsMatch && (
        <Text style={styles.passwordMismatch}>
          Passwords do not match
        </Text>
      )}

      {/* General error message */}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {/* Submit button */}
      <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Reset Password</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordStrengthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  passwordStrength: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  passwordStrengthPercentage: {
    fontSize: 16,
  },
  eyeIconContainer: {
    position: 'absolute',
    top: 12,
    right: 10,
  },
  progressBarContainer: {
    height: 3,
    backgroundColor: '#ccc',
    borderRadius: 4,
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  passwordMismatch: {
    color: 'red',
    marginBottom: 16,
  },
  button: {
    backgroundColor: 'green',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default ResetPasswordPage;
