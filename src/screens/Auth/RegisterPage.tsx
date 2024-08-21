import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import RegisterController from '../../controllers/auth/RegisterController';
import { ActivityIndicator, Divider } from 'react-native-paper';
import { CheckBox } from 'react-native-elements';
import * as FileSystem from 'expo-file-system';
import Icon from 'react-native-vector-icons/FontAwesome';

type ErrorType = {
  [key: string]: string[]; // Error object structure
};

const RegisterPage = ({ navigation }) => {

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [momoPayNumber, setMomoPayNumber] = useState('');
  const [idCardPhoto, setIdCardPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverErrors, setServerErrors] = useState<ErrorType>({});
  const [missingFields, setMissingFields] = useState([]);
  const [errorLocation, setErrorLocation] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordStrengthPercentage, setPasswordStrengthPercentage] = useState(0);
  const [gender, setGender] = useState({
    gender: 'male',
    maleButtonColor: '#eff',
    femaleButtonColor: '#eff',
    maleButtonTextColor: 'green',
    femaleButtonTextColor: 'green',
  });

  useEffect(() => {
    setPasswordsMatch(password === confirmPassword);
  }, [password, confirmPassword]);
  const handleMalePress = () => {
    setGender({
      gender: 'male',
      maleButtonColor: 'green',
      femaleButtonColor: '#eff',
      maleButtonTextColor: '#fff',
      femaleButtonTextColor: 'green',
    });
  };

  const handleFemalePress = () => {
    setGender({
      gender: 'female',
      maleButtonColor: '#eff',
      femaleButtonColor: 'green',
      maleButtonTextColor: 'green',
      femaleButtonTextColor: '#fff',
    });
  };

  const validateEmailOrPhone = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{10,13}$/;
    return emailRegex.test(input) || phoneRegex.test(input);
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasNumbers = /\d/;
    const hasLetters = /[a-zA-Z]/;
    return password.length >= minLength && hasNumbers.test(password) && hasLetters.test(password);
  };

  const handlePasswordChange = (password) => {
    setPassword(password);

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[a-zA-Z]/.test(password)) strength += 1;
    if (password.length >= 12) strength += 1;

    const strengthPercentage = (strength / 4) * 100;
    setPasswordStrengthPercentage(strengthPercentage);

    if (strength === 4) {
      setPasswordStrength('Password is strong');
    } else if (strength === 3) {
      setPasswordStrength('Password is good');
    } else if (strength === 2) {
      setPasswordStrength('Password is weak');
    } else {
      setPasswordStrength('Password is very weak');
    }
  };

  const imgTo64bit = async (photo_url) => {
    const base64 = await FileSystem.readAsStringAsync(photo_url, { encoding: 'base64' });
    return base64;
  };

  const handleRegistration = async () => {
    let error_msg = "";
    if (!firstName) {
      setErrorLocation("firstName");
      error_msg = 'You must enter first name.';
      setError(error_msg);
      ToastAndroid.showWithGravity(error_msg, ToastAndroid.SHORT, ToastAndroid.CENTER);
      return;
    }

    if (!lastName) {
      setErrorLocation("lastName");
      error_msg = 'You must enter last name.';
      setError(error_msg);
      ToastAndroid.showWithGravity(error_msg, ToastAndroid.SHORT, ToastAndroid.CENTER);
      return;
    }
    if (!validateEmailOrPhone(emailOrPhone)) {
      setErrorLocation("emailOrPhone");
      error_msg = 'Please enter a valid email address or phone number.';
      setError(error_msg);
      ToastAndroid.showWithGravity(error_msg, ToastAndroid.SHORT, ToastAndroid.CENTER);
      return;
    }
    if (!validatePassword(password)){
      setErrorLocation("password");
      error_msg = 'Password must be at least 8 characters long and contain both letters and numbers.';
      setError(error_msg);
      ToastAndroid.showWithGravity(error_msg, ToastAndroid.SHORT, ToastAndroid.CENTER);
      return;
    }

    if (password !== confirmPassword) {
      setErrorLocation("confirmPassword");
      error_msg = 'Passwords do not match.';
      setError(error_msg);
      ToastAndroid.showWithGravity(error_msg, ToastAndroid.SHORT, ToastAndroid.CENTER);
      return;
    }
    // if (!/^0\d{9}$/.test(momoPayNumber)) {
    //   setErrorLocation("momoPayNumber");
    //   error_msg = 'Please enter a valid mobile money number.';
    //   setError(error_msg);
    //   ToastAndroid.showWithGravity(error_msg, ToastAndroid.SHORT, ToastAndroid.CENTER);
    //   return;
    // }
    if (!agreeTerms) {
      setErrorLocation("agreeTerms");
      error_msg = 'You must agree to the terms and conditions.';
      setError(error_msg);
      ToastAndroid.showWithGravity(error_msg, ToastAndroid.SHORT, ToastAndroid.CENTER);
      return;
    }
    let id_card_photo ="";
    try {
      setLoading(true);
      if(idCardPhoto){
      id_card_photo = await imgTo64bit(idCardPhoto);
      }
      let phone = emailOrPhone;
      console.log("Before Sednign::>>",gender.gender);
      const result = await RegisterController(firstName,lastName,phone,momoPayNumber,gender.gender,emailOrPhone,password,id_card_photo);
      console.log(result);
      if (result.status_code ==200) {
        navigation.navigate('SuccessScreen', { message: result.message, firstname: firstName, accessToken: result.accessToken });
      } else {
        ToastAndroid.showWithGravity(result.message, ToastAndroid.SHORT, ToastAndroid.CENTER);
        
        // console.log(result.missing_fields[0]);
        setError(result.error);
        // setServerErrors(result.error);
        // setServerErrors(errors);
        // const { missing_fields, error: errors } = result.error;
        console.log(result.missing_fields);
        setMissingFields(result.missing_fields);
      }
    } catch (error){
      console.error('Error during registration:', error);
      setError('An error occurred during registration. Please check Network connectivity');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setIdCardPhoto(uri);
      }
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Create New Account</Text>
        <Text style={styles.label}>Join <Text style={{color:'green',fontWeight:'bold'}}> TDX</Text> aggregator community</Text>
        <Divider style={{marginBottom:10,backgroundColor:'green'}}></Divider>
        <Text style={styles.inputLabel}>First Name <Text style={{color: (errorLocation=="firstName")? 'red':'black'}}>*</Text> </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          value={firstName}
          onChangeText={setFirstName}
          keyboardType="default"
        />

        <Text style={styles.inputLabel}>Last Name <Text style={{color: (errorLocation=="lastName")? 'red':'black'}}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your last name"
          value={lastName}
          onChangeText={setLastName}
          keyboardType="default"
        />

        <Text style={styles.inputLabel}>Phone or Email <Text style={{color: (errorLocation=="emailOrPhone")? 'red':'black'}}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number or email"
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.inputLabel}>Gender <Text style={{color: (errorLocation=="gender")? 'red':'black'}}>*</Text></Text>
        <View style={styles.genderContainer}>
          <TouchableOpacity style={[styles.genderButton, { backgroundColor: gender.maleButtonColor }]} onPress={handleMalePress}>
            <Text style={[styles.genderButtonText, { color: gender.maleButtonTextColor }]}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.genderButton, { backgroundColor: gender.femaleButtonColor }]} onPress={handleFemalePress}>
            <Text style={[styles.genderButtonText, { color: gender.femaleButtonTextColor }]}>Female</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.inputLabel}>Password <Text style={{color: (errorLocation=="password")? 'red':'black'}}>*</Text></Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
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
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>
    {password &&(
      <View>
        <View style={styles.passwordStrengthContainer}>
        <Text style={[styles.passwordStrength, { color: passwordStrengthPercentage === 100 ? 'green' : (passwordStrengthPercentage >= 0 && passwordStrengthPercentage <= 50 ? 'red' : 'orange') }]}>
          {passwordStrength}
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

        <Text style={styles.inputLabel}>Confirm Password <Text style={{color: (errorLocation=="confirmPassword")? 'red':'black'}}>*</Text></Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            secureTextEntry={!isConfirmPasswordVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
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
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>
        {!passwordsMatch && (
          <Text style={styles.passwordMismatch}>
            Passwords do not match
          </Text>
        )}

        {/* <Text style={styles.inputLabel}>Mobile Money Number  <Text style={{color: (errorLocation=="momoPayNumber")? 'red':'black'}}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your mobile money number"
          value={momoPayNumber}
          onChangeText={setMomoPayNumber}
          keyboardType="phone-pad"
          autoCapitalize="none"
        /> */}

        <Text style={styles.inputLabel}>ID Card Photo</Text>
        {!idCardPhoto && (<>
          <TouchableOpacity style={styles.cameraButton} onPress={handleNext}>
          <Text style={styles.cameraButtonText}>Capture ID Card Photo</Text>
        </TouchableOpacity>
        </>)}
         
        
        {idCardPhoto && (
          <TouchableOpacity onPress={handleNext}> 
          <Image source={{ uri: idCardPhoto }} style={styles.capturedImage} />
          </TouchableOpacity>
        )}

        <CheckBox
          title="I agree to the terms and conditions"
          checked={agreeTerms}
          onPress={() => setAgreeTerms(!agreeTerms)}
          containerStyle={styles.checkboxContainer}
          textStyle={styles.checkboxText}
        />

        <Text style={styles.error}>{error}</Text>

        {missingFields.length > 0 && (
                <View style={{marginBottom:10}}>
                    {missingFields.map((field, index) => (
                        <Text key={index} style={{ color: 'red',textTransform:'capitalize' }}>
                            {field} field is required.
                        </Text>
                    ))}
                </View>
            )}

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <TouchableOpacity style={styles.registerButton} onPress={handleRegistration}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        )}

        <Divider style={styles.divider} />

        <Text style={styles.existingAccountText}>Already have an account?</Text>
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'green',
    // textAlign: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    // textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    width:'100%'
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  genderButton: {
    flex: 1,
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight:10
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordStrengthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 1,
  },
  passwordStrength: {
    fontSize: 14,
  },
  passwordStrengthPercentage: {
    fontSize: 14,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
    padding: 5,
  },
  eyeIcon: {
    width: 20,
    height: 20,
    marginTop:-15
  },
  progressBarContainer: {
    height: 3,
    backgroundColor: '#ccc',
    borderRadius: 4,
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'green',
    borderRadius: 4,
  },
  passwordMismatch: {
    color: 'red',
    marginBottom: 16,
  },
  cameraButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cameraButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  capturedImage: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    borderRadius:5
  },
  checkboxContainer: {
    marginBottom: 0,
  },
  checkboxText: {
    fontSize: 14,
  },
  registerButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  error: {
    color: 'red',
    marginTop: 5,
    marginBottom:0,
    textAlign: 'center',
  },
  divider: {
    marginVertical: 16,
  },
  existingAccountText: {
    fontSize: 16,
    textAlign: 'center',
  },
  loginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
});

export default RegisterPage;
