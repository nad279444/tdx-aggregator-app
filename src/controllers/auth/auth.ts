import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { JSHash, JSHmac, CONSTANTS } from 'react-native-hash';
import { BASE_URL } from '../../constants/Constants';
import { usePushNotifications } from '../../functions/useNotifications';


const auth = {
  postRequest: async (endpoint, data) => {
    try {
      const response = await axios.post(`${BASE_URL}/${endpoint}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error in ${endpoint}`, error);
      throw error;
    }
  },

  signUp: async (registrationData) => {
     return await auth.postRequest("signup",registrationData);

  },

  signIn: async ({username, password}) => {
    const challengeData = await auth.getChallenge(username);
    
    if (!challengeData.challenge) {
      alert("User not found");
      return null;
    }

    const challenge = challengeData.challenge;

    // Hash password using JSHash
    const sha256Password = await JSHash(password, CONSTANTS.HashAlgorithms.sha256);

    // Generate HMAC using JSHmac
    const responseToken = await JSHmac(challenge, sha256Password, CONSTANTS.HmacAlgorithms.HmacSHA256);
   
    const validationResult = await auth.validateResponse(responseToken);
     
    if (validationResult.message == "Success") {
      return validationResult
    } else {
      alert("Login failed");
      return null;
    }
  },

  signOut: async () => {
    await SecureStore.deleteItemAsync("userToken");
  },

  forgotPassword: async (data) => {
    return auth.postRequest("resetpassword", data);
  },

  confirmOTP: async ({otp,mobile,password,confirmpassword}) => {
    console.log({otp,mobile,password,confirmpassword})
    return auth.postRequest(`resetpassword/${otp}`,{mobile,password,confirmpassword});
  },

  getChallenge: async (username) => {
    return auth.postRequest(`get_challenge/${username}`, {username });
  },
  

  validateResponse: async (token) => {
    const expoToken = await SecureStore.getItemAsync('expoPushToken');
    const extractedId = expoToken ? expoToken.split('[')[1].split(']')[0] : '';
    return auth.postRequest(`validate_response/${token}/${extractedId}`,'');
  },

  // Methods using react-native-hash
  hashHMAC: async (message, key) => {
    return await JSHmac(message, key, CONSTANTS.HmacAlgorithms.HmacSHA256);
  },


};

export default auth;
