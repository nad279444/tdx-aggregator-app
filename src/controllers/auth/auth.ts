import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { JSHash, JSHmac, CONSTANTS } from 'react-native-hash';

const auth = {
  BASE_URL: "https://torux.app/api",

  postRequest: async (endpoint, data) => {
    try {
      const response = await axios.post(`${auth.BASE_URL}/${endpoint}`, data);
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
    const response = await JSHmac(challenge, sha256Password, CONSTANTS.HmacAlgorithms.HmacSHA256);

    const validationResult = await auth.validateResponse(response);
     
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

  resetPassword: async (data) => {
    return auth.postRequest("resetPassword", data);
  },

  confirmOTP: async (otp, data) => {
    return auth.postRequest(`resetPassword/${otp}`, data);
  },

  getChallenge: async (username) => {
    return auth.postRequest(`get_challenge/${username}`, {username });
  },
  

  validateResponse: async (response) => {
    return auth.postRequest(`validate_response/${response}`, { response });
  },

  // Methods using react-native-hash
  hashHMAC: async (message, key) => {
    return await JSHmac(message, key, CONSTANTS.HmacAlgorithms.HmacSHA256);
  },


};

export default auth;
